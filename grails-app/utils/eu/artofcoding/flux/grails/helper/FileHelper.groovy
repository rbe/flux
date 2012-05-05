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
package eu.artofcoding.flux.grails.helper

import java.io.File
import java.util.Map

/**
 * 
 * @author rbe
 */
final class FileHelper {
    
    /**
     * Decompose a filename in name and extension.
     * @param file
     * @return Map Keys: name, ext.
     */
    public static Map decomposeFilename(String filename) {
        Map map = [:]
        if (filename.contains('.')) {
            String[] split = filename.split('[.]')
            map['name'] = split[0..-2].join('')
            map['ext'] = split[-1] //.toLowerCase()
        } else {
            map['name'] = filename
            map['ext'] = 'xxx'
        }
        // Return
        map
    }
    
    /**
     * Convenience method for {@link decomposeFilename(String)}.
     * @see #decomposeFilename(String)
     * @param file
     * @return Map Keys: name, ext.
     */
    public static Map decomposeFilename(File file) {
        decomposeFilename(file.name)
    }
    
    /**
     * Check if two file have the same format/extension or not.
     * @param file1 Left/first file for check.
     * @param file2 Right/second file for check.
     * @return boolean
     */
    public boolean isDifferentFileFormat(File file1, File file2) {
        // Decompose both filenames
        Map<String, String> decomp1 = FileHelper.decomposeFilename(file1)
        Map<String, String> decomp2 = FileHelper.decomposeFilename(file2)
        // Extensions different?
        decomp1.ext.toLowerCase() != decomp2.ext.toLowerCase()
    }
    
}
