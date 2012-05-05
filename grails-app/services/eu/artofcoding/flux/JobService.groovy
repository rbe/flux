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

/**
 * A service to schedule jobs.
 */
class JobService {
    
    static transactional = true

	/**
	 * The Quartz scheduler.
	 */
	def quartzScheduler
	def jobManagerService
	
	/**
	 * Our main job and trigger group.
	 */
	def mainJobName = "eu.artofcoding.flux.Job"
	def mainJobGroup = "GRAILS_JOBS"
	
	//
	// QUARTZ JOBS
	//
	
	/**
	 * Dump a status of all jobs.
	 */
	def dumpJobs() {
		def jobDesc = []
		quartzScheduler.getJobGroupNames()?.each { jobGroup ->
			quartzScheduler.getJobNames(jobGroup)?.each { jobName ->
				quartzScheduler.getTriggersOfJob(jobName, jobGroup)?.sort { it.group }.each { trigger ->
					def state = quartzScheduler.getTriggerState(trigger.name, trigger.group)
					jobDesc << "dumpJobs: trigger.name=${trigger.name} trigger.group=${trigger.group} state=${state} jobName=${jobName} jobGroup=${jobGroup}"
				}
			}
		}
		jobDesc
	}
	
	/**
	 * Unschedule all, really all jobs.
	 */
	def unscheduleAllJobs() {
		if (log.traceEnabled) log.trace "unscheduleAllJobs()"
		quartzScheduler.getJobGroupNames()?.each { jobGroup ->
			quartzScheduler.getJobNames(jobGroup)?.each { jobName ->
				quartzScheduler.getTriggersOfJob(jobName, jobGroup)?.each { trigger ->
					def result = quartzScheduler.unscheduleJob(trigger.name, trigger.group)
					if (log.debugEnabled) log.debug "unscheduleAllJobs(): unscheduled trigger.name=${trigger.name} trigger.group=${trigger.group}: ${result}"
				}
			}
		}
	}
	
	/**
	 * Unschedule all triggers of a job.
	 */
	def unscheduleJob(arg) {
		if (log.traceEnabled) log.trace "unscheduleJob(${arg.inspect()})"
		assert arg.jobName
		quartzScheduler.getTriggersOfJob(arg.jobName, mainJobGroup)?.grep { trigger ->
			// Check trigger group (is cdd job name)
			trigger.group == arg.triggerGroup
		}.each { trigger ->
			def result = quartzScheduler.unscheduleJob(trigger.name, trigger.group)
			if (log.debugEnabled) log.debug "unscheduleJob(${arg.inspect()}): unscheduled trigger.name=${trigger.name} trigger.group=${trigger.group}: ${result}"
		}
	}
	
	/**
	 * Unschedule a certain trigger of a job.
	 */
	def unscheduleJobTrigger(arg) {
		if (log.traceEnabled) log.trace "unscheduleJobTrigger(${arg.inspect()})"
		assert arg.jobName && arg.triggerName
		// Find trigger
		def triggers = quartzScheduler.getTriggersOfJob(arg.jobName, mainJobGroup)?.grep { trigger ->
			trigger.name == arg.triggerName
		}
		assert triggers.size() == 1
		def trigger = triggers[0]
		if (log.traceEnabled) log.trace "unscheduleJobTrigger(${arg.inspect()}): trying to unschedule trigger ${trigger.group}/${trigger.name} for ${trigger.fullJobName}"
		def result = quartzScheduler.unscheduleJob(trigger.name, trigger.group)
		if (log.debugEnabled) log.debug "unscheduleJobTrigger(${arg.inspect()}): Unscheduled trigger ${trigger.group}/${trigger.name} for ${trigger.fullJobName}: ${result}"
	}
	
	/**
	 * Create a trigger that fires only once.
	 */
	def scheduleJobOnce(arg) {
		if (log.traceEnabled) log.trace "scheduleJobOnce(${arg.inspect()})"
		assert arg.jobName && arg.certainDate
		// Create new non-volatile trigger
		def trigger = new org.quartz.SimpleTrigger(arg.triggerName, arg.triggerGroup, arg.certainDate)
		trigger.volatility = false
		// Set referenced job name and job group
		trigger.jobName = mainJobName
		trigger.jobGroup = mainJobGroup
		// Set job data, which cdd job to execute?
		trigger.jobDataMap = [jobName: arg.jobName]
		// Schedule job
		try {
			quartzScheduler.scheduleJob(trigger)
		} catch (e) {
			log.error "scheduleJobOnce(${arg.inspect()}): ERROR=${e}"
		}
	}
	
	/**
	 * Create a cron trigger for a job.
	 */
	def scheduleJobPeriodically(arg) {
		if (log.traceEnabled) log.trace "scheduleJobPeriodically(${arg.inspect()})"
		assert arg.jobName && arg.triggerName && arg.triggerGroup && arg.cronExpr
		// Create new non-volatile trigger
		def trigger = new org.quartz.CronTrigger(arg.triggerName, arg.triggerGroup, arg.cronExpr)
		trigger.volatility = false
		// Set referenced job name and job group
		trigger.jobName = mainJobName
		trigger.jobGroup = mainJobGroup
		// Set first and last time of execution
		if (arg.firstExecutionAt) {
			trigger.startTime = arg.firstExecutionAt
		}
		if (arg.lastExecutionAt) {
			trigger.endTime = arg.lastExecutionAt
		}
		// Set job data, which cdd job to execute?
		trigger.jobDataMap = [jobName: arg.jobName]
		// Schedule job
		quartzScheduler.scheduleJob(trigger)
	}
	
}
