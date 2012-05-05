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

import groovy.sql.Sql

/**
 *
 */
class MassMailController {

    def dataSource

    /**
     * The mass mail service.
     */
    def massMailService

    /**
     *
     */
    def send = {
        // Object params will not be visible in runAsync{}
        def p = params
        // Lookup actionmail_mailing, STATUS = 1
        def sql = new Sql(dataSource)
        def result = sql.rows("SELECT id, email, body FROM actionmail_mailing WHERE aid = ?", [params.aid])
        //println "MassMailController.send: ${result.size()} rows"
        runAsync {
            def mailsSent = 0
            result.each {
                //println "MassMailController.send: ${it}"
                if (it.email) {
                    massMailService.send([
                            host: "mail.1ci.net",
                            port: 465,
                            useSSL: true,
                            username: "email@domain.de", password: "password",
                            charset: "UTF8",
                            to: it.email,
                            from: "bvk@bvk.de", fromName: "BVK Petition",
                            subject: "BVK e.V. - Einladung zur Teilnahme an einer Petition des BVK e.V.",
                            body: it.body
                    ])
                    mailsSent++
                }
            }
            println "${result.size()}/${mailsSent} mails sent."
            // In der Datenbank speichern, wann und das Actionmail komplett verschickt wurde
            def ts = java.lang.Math.round(new java.util.Date().time / 1000)
            sql.executeUpdate("UPDATE actionmail SET status = 2, sendtimestamp = ? WHERE id = ?", [ts, p.aid])
            sql.commit()
            // Disconnect
            sql.close()
        }
        // Render answer
        render "MASSMAIL JOB ${params.aid} STARTED"
    }

}
