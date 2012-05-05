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

import org.apache.commons.mail.SimpleEmail

/**
 * 
 */
class MassMailService {

    static transactional = true
    
    /**
     * 
     */
    def charset = { email, s, charset, closure ->
        if (!s) return
        //println "charset: $email, $s, $charset"
		if (s.length() > 2) {
			def b = new String(s.getBytes(charset))
			if (b.length() > 0) {
				b.split(",").each {
					def t = new String(it.getBytes(charset), charset)
					closure(t, charset)
				}
			}
		}
    }
    
    /**
     * @param arg A map
     *              host: ""
     *              port: 0
     *              useSSL: true|false
     *              username: "", password: ""
     *              charset: ""
     *              to: "a,b,c"
     *              cc: "a,b,c"
     *              bcc: "a,b,c"
     *              from: "a", fromName
     *              subject: ""
     *              
     */
    def send(arg) {
        // Send email
		def email = new SimpleEmail()
		email.with {
			// Host, port, ...
			setHostName(arg.host)
			setSmtpPort(arg.port)
			setAuthentication(arg.username, arg.password)
			if (arg.useSSL || arg.port == 465) {
				setSSL(true)
			}
			// Charset
			if (!arg.charset) {
			    arg.charset = "UTF8"
			}
			// To
			charset(email, arg.to, arg.charset, { t, charset -> email.addTo(t, t, charset) })
			// Cc
			charset(email, arg.cc, arg.charset, { t, charset -> email.addCc(t, t, charset) })
			// Bcc
			charset(email, arg.bcc, arg.charset, { t, charset -> email.addBcc(t, t, charset) })
			// Reply-to
			//// TODO setReplyTo()
			// From
			setFrom(arg.from, arg.fromName ?: "Fluxx Mail Service")
			// Subject
			setSubject(arg.subject ?: "Forgotton subject.")
			// Set body
			if (!arg.body) arg.body = "The suprise is - there  i s  n o  surprise."
			// Set charset and body
			setCharset(arg.charset)
			setMsg(new String(arg.body.getBytes(arg.charset), arg.charset))
			// Send it
			addHeader("X-Mailer", "${this.class.simpleName}/0" as String)
			send()
		}
    }
    
}
