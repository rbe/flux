import groovy.xml.StreamingMarkupBuilder

eventWebXmlEnd = { String tmpfile ->
    def root = new XmlSlurper().parse(webXmlFile)
    root.appendNode {
        'listener' {
            'listener-class'('eu.artofcoding.flux.session.FluxSessionListener')
        }
    }
    webXmlFile.text = new StreamingMarkupBuilder().bind {
        //mkp.declareNamespace('': 'http://java.sun.com/xml/ns/j2ee')
        mkp.yield(root)
    }
}
