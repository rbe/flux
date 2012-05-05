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

import javax.servlet.http.HttpSession
import javax.servlet.http.HttpSessionEvent

/**
 * 
 * @author rbe
 */
class HttpSessionService {
    
    /**
     * Return all session attributes as a String.
     * @param session
     * @return
     */
    String getSessionAttributesAsString(HttpSession session) {
        StringBuilder sb = new StringBuilder()
        session.attributeNames.each { attr ->
            sb << "  attribute: ${attr}\n"
        }
        sb.toString()
    }
    
    /**
     * A session was created.
     * @param event
     * @return
     */
    def sessionCreated(HttpSessionEvent event) {
        log.trace "${this}.sessionCreated(${event}):\n${getSessionAttributesAsString(event.session)}"
    }
    
    /**
     * A session is about to be destroyed.
     * @param event
     * @return
     */
    def sessionDestroyed(HttpSessionEvent event) {
        log.trace "${this}.sessionDestroyed(${event}):\n${getSessionAttributesAsString(event.session)}"
    }
    
}