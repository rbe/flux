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

import eu.artofcoding.flux.domain.GlueAssoc
import grails.converters.JSON
import org.codehaus.groovy.grails.commons.DefaultGrailsDomainClass
import org.codehaus.groovy.grails.commons.DefaultGrailsDomainClassProperty
import org.codehaus.groovy.grails.commons.GrailsClass
import org.hibernate.Hibernate
import org.springframework.beans.factory.InitializingBean

/**
 * 
 */
class CrudService {
    
	/**
	 * The scope. See http://www.grails.org/Services.
	 */
	def scope = "prototype" // prototype request flash flow conversation session singleton
	
	/**
	 * Transactional?
	 */
	boolean transactional = true
	
	/**
	 * 
	 */
	def grailsApplication
	
	/**
	 * 
	 */
	def nameService
	
	/**
	 * 
	 */
	def configurationService
	
	/**
	 * 
	 */
	def domainClassService
	
	//
	// DOMAIN CLASSES
	//
	
	/**
	 * Create a domain instance. Take care of Glue constraints.
	 * @param arg: Map: domain, property (a map)
	 */
	def create(arg) {
		if (log.traceEnabled) log.trace "create(${arg.inspect()})"
		assert arg.domain && !arg.domainId
		// Lookup Glue constraints
		// Execute pre-hooks
		// Create new instance
		if (log.traceEnabled) log.trace "create(${arg.inspect()}): creating new inst of ${arg.domain}"
		def inst = domainClassService.newInstance(domain: arg.domain)
		assert inst
		// Set defaults in new domain instance
		if (arg.gxdefaults) {
			if (log.traceEnabled) log.trace "create(${arg.inspect()}): settings defaults for new instance of ${arg.domain} -> ${arg.gxdefaults}"
			inst.properties = arg.gxdefaults
		}
		// Set a name
		try {
			if (!inst.name) {
				inst.name = "GENERATED ${inst.class.simpleName} at ${new Date().format("dd.MM.yyyy HH:mm:ss")}"
			}
		} catch (e) {
			log.error "create(${arg.inspect()}): Property name not existant in domain class ${arg.domain}"
		}
		// Save instance
		if (log.traceEnabled) log.trace "create(${arg.inspect()}): saving inst"
		inst.save(flush: true)
		inst.refresh()
		// Execute after-hooks
		inst
	}
	
	/**
	 * Read/lookup a domain instance. Take care of Glue constraints.
	 * @param arg: Map: domain, domainId or property (a map)
	 */
	def read(arg) {
		if (log.traceEnabled) log.trace "read(${arg.inspect()})"
		assert arg.domain && arg.domainId
		// Lookup Glue constraints
		// Execute pre-hooks
		// Lookup instance
		def inst = domainClassService.getInstance(domain: arg.domain, id: arg.domainId)
		assert inst
		// Execute after-hooks
		// Return instance: a list of instance(s)
		if (log.traceEnabled) log.trace "read(${arg.inspect()}): returning inst=${inst}"
		inst
	}
	
	/**
	 * Update a domain instance. Take care of Glue constraints.
	 * @param arg: Map: domain, domainId or inst, property (a map)
	 */
	def update(arg) {
		if (log.traceEnabled) log.trace "update(${arg.inspect()})"
		assert ((arg.domain && arg.domainId) || arg.inst) && arg.properties
		// TODO - HACK FOR FIREFOX
		if (arg.domain instanceof String[]) {
			arg.domain = arg.domain[0]
		}
		if (arg.domainId instanceof String[]) {
			arg.domainId = arg.domainId[0].toLong()
		}
		//
		// Lookup instance?
		if (!arg.inst) {
			arg.inst = read(domain: arg.domain, domainId: arg.domainId)
		}
		assert arg.inst
		// Lookup Glue constraints
		// Execute pre-hooks
		/*/ TODO Check against different user (for sub-sequent updates e.g. via AJAX)
		if (params.version) {
			def version = params.version.toLong()
			if (flash.inst.version > version) {
				flash.inst.errors.rejectValue("version", "${lowerCaseName}.optimistic.locking.failure", "Another user has updated this ${className} while you were editing.")
				render(view: 'edit', model: [${propertyName}: ${propertyName}])
				return
			}
		}
		*/
		// TODO Use params.$full#Masked#Domain#Name for domain instance's values
		// Set new values in domain instance
		try {
			arg.inst.properties = arg.properties + [dirty: true]
		} catch (e) {
			////e.printStackTrace()
			log.error "update(${arg.inspect()}): setting properties raised ${e}"
			throw new IllegalStateException(e)
		}
		// Save instance
		try {
			if (log.traceEnabled) log.trace "update(${arg.inspect()}): saving arg.inst"
			arg.inst = arg.inst.merge(flush: true)
		} catch (e) {
			////e.printStackTrace()
			log.error "update(${arg.inspect()}): saving instance raised ${e}"
			throw new IllegalStateException(e)
		}
		assert arg.inst
		// Execute after-hooks
		if (log.traceEnabled) log.trace "update(${arg.inspect()}): updated."
		arg.inst
	}
	
	/**
	 * Delete a domain instance. Take care of Glue constraints.
	 * @param arg: Map: domain, domainId
	 */
	def delete(arg) {
		if (log.traceEnabled) log.trace "delete(${arg.inspect()})"
		assert arg.inst
		// Lookup Glue constraints
		// Execute pre-hooks
		// Save instance in archive?
		// Delete instance
		// Execute after-hooks
	}
	
	//
	// ASSOCIATION
	//
	
	/**
	 * Associate or dissociate two domain instances A and B where A.reference_to_b = B.
	 * @param arg Map: type, domainA, idA, property, domainB, idB
	 * 		domainA: String, idA: Long or domainA: GrailsClass, idA: not needed
	 * 		propertyA: String
	 * 		domainB: String, idB: Long or domainB: GrailsClass, idB: not needed
	 * 		propertyB: Map; dynamically create instance of domainB with this properties
	 * @return Modified instance domainA
	 */
	def associate(arg) {
		if (log.traceEnabled) log.trace "associate(${arg.inspect()})"
		// Find instance of domain A and domain B
		def instA = domainClassService.getInstance(domain: arg.domainA, id: arg.idA)
		if (!instA) {
			log.error "associate(${arg.inspect()}): Can't associate, entity is null: instA=${instA}"
			return
		}
		def instB
		// We don't need instB when dissociating a one-to-one property
		if (arg.domainB && arg.idB && !arg.propertyB) {
			instB = domainClassService.getInstance(domain: arg.domainB, id: arg.idB)
		}
		// Intelligent associate: create entity if it does not exist
		// TODO Use create()
		else if (!instB) {
			// We need a map
			if (!(arg.propertyB instanceof Map)) {
				// Try to set a name
				arg.propertyB = [name: arg.propertyB ?: "GENERATED"]
			}
			// Lookup property
			// TODO Use GlueCrudService.read?!
			instB = domainClassService.getInstance(domain: arg.domainB, property: arg.propertyB)
			if (log.traceEnabled) log.trace "associate(${arg.inspect()}): instB=${instB}"
			// No instance found, create new
			if (!instB) {
				// TODO Use GlueCrudService.create?!
				instB = domainClassService.newInstance(domain: arg.domainB)
				instB.properties = arg.propertyB // Must be a map
				// Save new domain instance
				try {
					instB.validate()
					instB.save(flush: true)
					instB.refresh()
				} catch (e) {
					log.error "associate(${arg.inspect()}): could not create new instance: domainB=${arg.domainB} propertyB=${arg.propertyB}: ${e} for arg=${arg.inspect()}"
					return
				}
				if (log.traceEnabled) log.trace "associate(${arg.inspect()}): created new instance: ${instB}"
			}
		}
		// Try to associate or dissociate
		if (instA) {
			// Type
			def method
			if (arg.dissociate) { // Default is to associate
				method = "removeFrom"
			} else {
				method = "addTo"
			}
			// Associate: one-to-one or one-to-many?
			def p = domainClassService.getProperty(domain: arg.domainA, property: arg.propertyA)
			try {
				if (p.oneToOne || p.manyToOne) {
					instA."${arg.propertyA}" = method == "addTo" ? instB : null
				} else if (p.oneToMany || p.manyToMany) {
					if (method == "addTo") {
						instA."addTo${nameService.ucFirst(arg.propertyA)}"(instB)
					} else if (method == "removeFrom") {
						// If just one association is left, set it to null
						// REASON: when one object in list is left, removeFrom does not have an effect?
						if (instA."${arg.propertyA}"?.size() == 1) {
							instA."${arg.propertyA}" = null
						} else {
							instA."removeFrom${nameService.ucFirst(arg.propertyA)}"(instB)
						}
					}
				} else {
					throw new IllegalStateException("associate(${arg.inspect()}): don't know how to deal with association, method=${method}")
				}
				// Validate, save
				instA.validate()
				instA.save(flush: true)
				instA.refresh()
				// One-to-my-many?
				def isOneToMyMany = configurationService.isOneToMyManyMapping(domain: arg.domainA, property: arg.propertyA)
				if (log.traceEnabled) log.trace "associate(${arg.inspect()}): isOneToMyMany=${isOneToMyMany}"
				if (isOneToMyMany) {
					// Successfully saved, remember association (for queries)
					def foundAssoc = domainClassService.findAssociation(
						domainA: arg.domainA, domainIdA: arg.idA, propertyA: arg.propertyA,
						domainB: arg.domainB, domainIdB: instB.id
					)
					if (log.traceEnabled) log.trace "associate(${arg.inspect()}): foundAssoc=${foundAssoc}"
					if (method == "addTo") {
						if (!foundAssoc) {
							if (log.traceEnabled) log.trace "associate(${arg.inspect()}): creating new assoc"
							// TODO Create as method: GlueDomainClassService.rememberAssoc
							new GlueAssoc(
								domainA: arg.domainA, domainIdA: arg.idA, propertyA: arg.propertyA,
								domainB: arg.domainB, domainIdB: instB.id, active: true
							).save(flush: true)
						} else {
							// TODO Create as method: GlueDomainClassService.activateAssoc
							foundAssoc[0].active = true
							foundAssoc[0].save(flush: true)
							if (log.traceEnabled) log.trace "associate(${arg.inspect()}): foundAssoc=${foundAssoc[0]}, active=${foundAssoc[0].active}"
						}
					} else if (method == "removeFrom") {
						// TODO Create as method: GlueDomainClassService.inactivateAssoc
						foundAssoc[0].active = false
						foundAssoc[0].save(flush: true)
						if (log.traceEnabled) log.trace "associate(${arg.inspect()}): foundAssoc=${foundAssoc[0]}, active=${foundAssoc[0].active}"
					}
				}
			} catch (e) {
				e.printStackTrace()
				throw new IllegalStateException("associate(${arg.inspect()}): can't associate ${instA} property ${arg.propertyA} with ${instB}: ${e}", e)
			}
			instA
		} else {
			e.printStackTrace()
			throw new IllegalStateException("associate(${arg.inspect()}): can't associate, entity is null: instA=${instA} instB=${instB}")
		}
	}
	
	/**
	 * Dissociate two entities. See associate(arg).
	 * @param arg Map: type, domainA, idA, property, domainB, idB
	 * 		domainA: String, idA: Long or domainA: GrailsClass, idA: not needed
	 * 		propertyA: String
	 * @return Modified instance domainA
	 */
	def dissociate(arg) {
		associate(arg + [dissociate: true])
	}
	
	/**
	 * Test whether a association between two domain instances exist.
	 * @param arg Map: type, domainA, idA, property, domainB, idB
	 * 		domainA: String, idA: Long or domainA: GrailsClass, idA: not needed
	 * 		propertyA: String
	 * 		domainB: String, idB: Long or domainB: GrailsClass, idB: not needed
	 */
	def isAssociated(arg) {
		// Find instance of domain A and domain B
		def instA = domainClassService.getInstance(domain: arg.domainA, id: arg.idA)
		if (!instA) {
			log.error "Can't check association, entity is null: instA=${instA}"
			false
		}
		def instB = domainClassService.getInstance(domain: arg.domainB, id: arg.idB)
		if (!instB) {
			log.error "Can't check association, entity is null: instB=${instB}"
			false
		}
		// Associate: one-to-one or one-to-many?
		def p = domainClassService.getProperty(domain: arg.domainA, property: arg.propertyA)
		if (p.oneToOne) {
			instA."${arg.propertyA}" == instB ? true : false
		} else if (p.oneToMany || p.manyToMany) {
			instA."${arg.propertyA}".any { it.id == instB.id } // Must use .id: oneToMany: [Person : 1].any Person : 1 --> false ??? 
		}
	}
	
	/**
	 * Switch an association: associate if not already associated, or dissociate.
	 * @param arg Map: type, domainA, idA, property, domainB, idB
	 * 		domainA: String, idA: Long or domainA: GrailsClass, idA: not needed
	 * 		property: String
	 * 		domainB: String, idB: Long or domainB: GrailsClass, idB: not needed
	 * 		propertyB: Map; dynamically create instance of domainB with this properties
	 */
	def switchAssociation(arg) {
		def isa = isAssociated(arg)
		if (log.traceEnabled) log.trace "switchAssociation: ${arg.inspect()}: isa=${isa} -> will ${isa ? 'diss' : 'ass'}ociate"
		isa ? dissociate(arg) : associate(arg)
	}
	
}
