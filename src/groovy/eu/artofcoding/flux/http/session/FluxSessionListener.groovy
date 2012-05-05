/**
 * Flux
 * Copyright (C) 2009-2010 Informationsysteme Ralf Bensmann.
 * Copyright (C) 2011-2012 art of coding UG (haftungsbeschränkt).
 *
 * Alle Rechte vorbehalten, siehe http://files.art-of-coding.eu/aoc/AOCPL_v10_de.html
 * All rights reserved. Use is subject to license terms, see http://files.art-of-coding.eu/aoc/AOCPL_v10_en.html
 *
 */
package eu.artofcoding.flux.http.session

import eu.artofcoding.flux.HttpSessionService

import javax.servlet.http.HttpSession
import javax.servlet.http.HttpSessionEvent
import javax.servlet.http.HttpSessionListener

import org.springframework.web.context.WebApplicationContext
import org.springframework.web.context.support.WebApplicationContextUtils

/**
 * Delegate HTTP session events to a Grails service.
 * @author rbe
 */
class FluxSessionListener implements HttpSessionListener {
    
    private HttpSessionService httpSessionService
    
    private synchronized HttpSessionService getHttpSessionService(servletContext) {
        WebApplicationContext x = WebApplicationContextUtils.getWebApplicationContext(servletContext)
        if (null == httpSessionService) {
            httpSessionService = (HttpSessionService) x.getBean('httpSessionService')
        }
        return httpSessionService
    }
    
    // called by servlet container upon session creation
    void sessionCreated(HttpSessionEvent event) {
        getHttpSessionService(event.session.servletContext).sessionCreated(event)
    }
    
    // called by servlet container upon session destruction
    void sessionDestroyed(HttpSessionEvent event) {
        getHttpSessionService(event.session.servletContext).sessionDestroyed(event)
    }
    
}
