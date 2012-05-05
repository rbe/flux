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

import grails.converters.JSON
import grails.converters.XML

/**
 * Grails converters reference: http://grails.org/Converters+Reference
 */
class CrudController {
    
    /**
     * 
     */
    private def sendXmlResponse = { resp, charset = "UTF-8" ->
        println "sendXmlResponse: resp=${resp as XML}"
        response.contentType = "text/xml; charset=${charset}"
        render resp as XML
    }
    
    /**
     * 
     */
    private def sendJsonResponse = { resp, charset = "UTF-8" ->
        println "sendJsonResponse: resp=${resp as JSON}"
        response.contentType = "text/json; charset=${charset}"
        render resp as JSON
    }
    
    /**
     * 
     */
    def desc = {
        println "CrudController.desc"
        withFormat {
            html {
                println "format=HTML"
                println "params: $params"
                println "request:"
                request.properties.sort { it.key }.each { k, v -> println "$k = $v"}
                render "Yo"
            }
            xml {
                println "format=XML"
                println "params: $params"
                def xml = request.XML
                println "request.XML: ${xml}"
                def a = [a: [b: 1]]
                println a as XML
                render a as XML
            }
            json {
                println "format=JSON"
                println "params: $params"
                def json = request.JSON
                println "request.JSON: ${json}"
                def a = [a: 1]
                println a as JSON
                render a as JSON
            }
        }
    }
    
    /**
     * Create an instance of a domain class and persist it.
     */
    def create = {
        println "CrudController.create"
    }
    
    /**
     * 
     */
    def show = {
        println "CrudController.show"
        request.headerNames.each { println "header: $it" }
        request.attributeNames.each { println "attribute: $it" }
        request.properties.sort { it.key }.each { k, v -> if (k != "XML") println "prop: $k = $v" }
        println "params: $params"
        println "request.XML: ${request.XML}"
        /*def result = "${params.domain}".list()
        println result
        render result as JSON*/
        render "Yo"
    }
    
    def list = {
        println "CrudController.list"
    }
    
    def read = {
        println "CrudController.read"
    }
    
    def save = {
        println "CrudController.save"
        withFormat {
            html {
                println "format=HTML"
                println "params: $params"
                println "request:"
                request.properties.sort { it.key }.each { k, v -> println "$k = $v"}
                render "Yo"
            }
            xml {
                println "format=XML"
                println "params: $params"
                def xml = request.XML
                println "request.XML: ${xml}"
                def a = [a: [b: 1]]
                sendXmlResponse a
                /*
                println a as XML
                response.contentType = "text/xml; charset=utf-8"
                render a as XML
                render(contentType: "text/xml", charset: "UTF-8", converter: XML) {
                    [a: [b: 1]]
                }
                */
            }
            json {
                println "format=JSON"
                println "params: $params"
                def json = request.JSON
                println "request.JSON: ${json}"
                def a = [a: 1]
                sendJsonResponse a
                /*
                println a as JSON
                render a as JSON
                */
            }
        }
    }
    
    def update = {
        println "CrudController.update"
        request.headerNames.each { println "header: $it" }
        request.attributeNames.each { println "attribute: $it" }
        request.properties.sort { it.key }.each { k, v -> println "prop: $k = $v" }
        println "params: $params"
        println "request.XML: ${request.XML}"
        /*def result = "${params.domain}".list()
        println result
        render result as JSON*/
        render "Yo"
    }
    
    def delete = {
        println "CrudController.delete"
    }
    
}
