import groovyx.net.http.ContentType
import groovyx.net.http.HTTPBuilder
import groovyx.net.http.Method
import groovyx.net.http.RESTClient

@Grab(group='org.codehaus.groovy.modules.http-builder', module='http-builder', version='0.5.1')

def mainURL = "http://localhost:8080"

def postXML = {
    def http = new HTTPBuilder(mainURL)
    http.request(Method.POST, ContentType.XML) { req ->
        uri.path = "/flux/crud"
        //headers.Accept = "text/xml"
        body = {
            root {
                hello 'world'
            }
        }
        response.success = { resp, xml ->
            resp.headers.each { println it }
            println "result=${xml."entry".@key}"
            println "postXML: statusCode=${resp.statusLine.statusCode} ${resp.headers.'Content-Type'} data=${resp.data}"
        }
    }
}

def restXML = {
    def rest = new RESTClient(mainURL)
    def resp = rest.post(path: "/flux/crud", requestContentType: ContentType.XML, body: {
            root {
                hello 'world'
            }
        })
    resp.headers.each { println it }
    println resp.data."entry".@key
}

def postJSON = {
    def http = new HTTPBuilder(mainURL)
    http.request(Method.POST, ContentType.JSON) {
        uri.path = "/flux/crud"
        body = [root: [hello: "world"]]
        response.success = { resp, json ->
            resp.headers.each { println it }
            println "postJSON: statusCode=${resp.statusLine.statusCode} data=${resp.data} json=${json}"
        }
    }
}

def restJSON = {
    def rest = new RESTClient(mainURL)
    def resp = rest.post(path: "/flux/crud", requestContentType: ContentType.JSON, body: [root: [hello: "world"]])
    println "restJSON: data=${resp.data}"
}

restXML()