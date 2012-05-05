/**
 * Flux
 * Copyright (C) 2009-2010 Informationsysteme Ralf Bensmann.
 * Copyright (C) 2011-2012 art of coding UG (haftungsbeschränkt).
 *
 * Alle Rechte vorbehalten, siehe http://files.art-of-coding.eu/aoc/AOCPL_v10_de.html
 * All rights reserved. Use is subject to license terms, see http://files.art-of-coding.eu/aoc/AOCPL_v10_en.html
 *
 */
package eu.artofcoding.flux.spring

import org.codehaus.groovy.grails.commons.GrailsApplication
import org.codehaus.groovy.grails.plugins.GrailsPluginManager
import org.springframework.context.ApplicationContext
import org.springframework.context.ApplicationContextAware

import javax.servlet.ServletContext

/**
 * Example for Spring's WebApplicationContextUtils:
 * <pre>
 * class Bla {
 *     def grailsApplication
 *     def servletContext
 *     public blub() {
 *         WebApplicationContext x = WebApplicationContextUtils.getWebApplicationContext(event.session.servletContext)
 *     }
 * }
 * </pre>
 * @deprecated Use org.springframework.web.context.support.WebApplicationContextUtils.
 * @author rbe
 */
@Singleton
class ApplicationContextHolder implements ApplicationContextAware {

    private ApplicationContext ctx

    private static final Map<String, Object> TEST_BEANS = [:]

    void setApplicationContext(ApplicationContext applicationContext) {
        ctx = applicationContext
    }

    static ApplicationContext getApplicationContext() {
        getInstance().ctx
    }

    static Object getBean(String name) {
        TEST_BEANS[name] ?: getApplicationContext().getBean(name)
    }

    static GrailsApplication getGrailsApplication() {
        getBean('grailsApplication')
    }

    static ConfigObject getConfig() {
        getGrailsApplication().config
    }

    static ServletContext getServletContext() {
        getBean('servletContext')
    }

    static GrailsPluginManager getPluginManager() {
        getBean('pluginManager')
    }

    // For testing
    static void registerTestBean(String name, bean) {
        TEST_BEANS[name] = bean
    }

    // For testing
    static void unregisterTestBeans() {
        TEST_BEANS.clear()
    }
}
