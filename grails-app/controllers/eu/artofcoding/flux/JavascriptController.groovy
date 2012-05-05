/*
 * Flux, https://github.com/rbe/flux
 * Copyright (C) 2009-2010 Informationssysteme Ralf Bensmann.
 * Copyright (C) 2011-2012 art of coding UG (haftungsbeschränkt).
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
 * to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions
 * of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
 * OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
 * OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

package eu.artofcoding.flux

import com.yahoo.platform.yui.compressor.JavaScriptCompressor
import eu.artofcoding.flux.grails.helper.ControllerBase
import org.mozilla.javascript.ErrorReporter
import org.mozilla.javascript.EvaluatorException

/**
 * 
 * @author rbe
 */
public class JavascriptController extends ControllerBase {
    
    /**
     * Error reporter.
     */
    public static class YuiCompressorErrorReporter implements ErrorReporter {
        
        public void warning(String message, String sourceName, int line, String lineSource, int lineOffset) {
            if (line < 0) {
                log.warn message
            } else {
                log.warn line + ':' + lineOffset + ':' + message
            }
        }
        
        public void error(String message, String sourceName, int line, String lineSource, int lineOffset) {
            if (line < 0) {
                log.error message
            } else {
                log.error line + ':' + lineOffset + ':' + message
            }
        }
        
        public EvaluatorException runtimeError(String message, String sourceName, int line, String lineSource, int lineOffset) {
            error(message, sourceName, line, lineSource, lineOffset)
            return new EvaluatorException(message)
        }
    }
    
    /**
     * Compress JavaScript through YUI Compressor.
     * @param inputFilename
     * @param outputFilename
     * @param options
     * @return java.io.File reference to minified file.
     * @throws IOException
     */
    private File compressJavaScript(File input, File output) throws IOException {
        log.trace "${request.uri} stream: Compressing ${input.absolutePath}/${input.exists()} to ${output.absolutePath}/${output.exists()}"
        // Options for YUI Compressor
        Map options = [
                            charset: 'UTF-8',
                            lineBreakPos: -1,
                            munge: true,
                            verbose: false,
                            preserveAllSemiColons: false,
                            disableOptimizations: false
                        ]
        Reader reader = null
        Writer writer = null
        try {
            reader = new InputStreamReader(new FileInputStream(input), options.charset)
            JavaScriptCompressor compressor = new JavaScriptCompressor(reader, new YuiCompressorErrorReporter())
            // Close the input stream first, and then open the output stream,
            // in case the output file should override the input file.
            reader.close(); reader = null
            writer = new OutputStreamWriter(new FileOutputStream(output), options.charset)
            compressor.compress(writer, options.lineBreakPos, options.munge, options.verbose, options.preserveAllSemiColons, options.disableOptimizations)
        } finally {
            reader?.close()
            writer?.close()
        }
    }
    
    /**
     * @param dir
     * @return
     */
    private List addScriptDir(String[] scriptPart) {
        log.trace "${request.uri} addScriptDir: script=${scriptPart}"
        Map scripts = [constructor: [], member: []]
        File baseScriptDirectory = new File('web-app/js')
        // Look for 'constructor scripts' which usually create a namespace
        // in upper directories
        try {
            def p = null
            File f = null
            for (int i = 0; i < scriptPart.length - 1; i++) {
                p = scriptPart[0..i]
                f = new File("${baseScriptDirectory}/${p.join('/')}", p.join('.') + '.js')
                // Add constructor script
                if (f.exists()) {
                    log.trace "${request.uri} addScriptDir: Adding constructor script ${f}"
                    scripts.constructor << f
                }
            }
        } catch (e) {
            log.error e
        }
        // Add main script
        String constructorScriptName = scriptPart.join('.') + '.js'
        String mainScriptDirPart = scriptPart.join('/') // scriptPart.length == 1 ? scriptPart[0] : scriptPart[0..-1].join('/')
        File mainScript = new File("${baseScriptDirectory}/${mainScriptDirPart}", constructorScriptName)
        // Add other files from (sub)directory/ies
        File scriptDirectory = mainScript.parentFile
        if (scriptDirectory.exists()) {
            log.trace "${request.uri} addScriptDir: Traversing ${scriptDirectory}"
            List files = []
            scriptDirectory.eachFileRecurse {
                if (it.isFile() && it.name.endsWith('.js')) files << it
            }
            files.sort { File f -> f.name.length() }.each { f ->
                // Find constructor script: a/b -> a.b.js
                constructorScriptName = (f.parentFile.absolutePath - baseScriptDirectory.absolutePath)[1..-1].replaceAll('/', '.') + '.js'
                if (f.name.endsWith('.js')) {
                    // Append main script at beginning of list
                    if (f.name == constructorScriptName) {
                        log.trace "${request.uri} addScriptDir: Adding constructor script ${f}"
                        scripts.constructor << f
                    } else {
                        log.trace "${request.uri} addScriptDir: Adding member script ${f}"
                        scripts.member << f
                    }
                }
            }
        }
        // Return scripts
        log.trace "${request.uri} addScriptDir: Returning scripts: ${scripts.constructor.size()} ${scripts.constructor}, ${scripts.member.size()} ${scripts.member}"
        scripts.constructor + scripts.member
    }
    
    /**
     * @param scripts Requested scripts.
     * @return List of byte arrays: content of files.
     */
    private File buildSingleScript(String[] scripts) {
        log.trace "${request.uri} buildSingleScript: scripts=${scripts}"
        // Find each file and concatenate them
        List b = []
        scripts.each { script ->
            String[] scriptPart = script.split('[.]')
            log.trace "${request.uri} buildSingleScript: ${script} -> ${scriptPart}"
            try {
                b += addScriptDir(scriptPart)
            } catch (e) {
                log.error e
            }
        }
        //
        File scriptOutput = File.createTempFile('flux_', '.js')
        scriptOutput.withOutputStream { writer ->
            log.trace "${request.uri} buildSingleScript: Writing combined script to ${scriptOutput}"
            b.each { writer.write(it.bytes) }
        }
        // Return combined script
        return scriptOutput
    }
    
    /**
     * Stream requested scripts as a single, compressed file.
     */
    def stream() {
        log.trace "${request.uri} stream: ${params}"
        // Set content type for response
        response.contentType = 'text/javascript'
        response.characterEncoding = 'UTF-8'
        // The compressed result
        File output = null
        try {
            // Analyze requested scripts, URL: /js/<script1+script2+scriptN...>.js
            String[] scripts = params.script.split('[ ]')
            log.trace "${request.uri} stream: ${scripts.length} scripts=${scripts}"
            // Compressed output
            output = new File('web-app/js', "${scripts.join('+')}")
            // Compress JavaScript, if output exists/input was not compressed before
            if (!output.exists() || params.containsKey('refresh')) {
                // Create combined script
                File scriptOutput = buildSingleScript(scripts)
                // Send compressed JavaScript
                compressJavaScript(scriptOutput, output)
                // Remove temporary file for combined scripts
                scriptOutput?.deleteOnExit()
                scriptOutput?.delete()
            }
            // Stream generated script using gzip compression
            if (output) {
                super.stream(request, response, output.bytes)
            } else {
                // Stream error message
                streamString(response, "/* Sorry, ${request.uri}: No content */")
            }
        } catch (e) {
            e.printStackTrace()
            output = null
            // Stream error message
            streamString(response, "/* Sorry, ${request.uri}: ${e} */")
        } finally {
            // Flush stream
            response.outputStream.flush()
        }
    }
    
}
