const resourceUtil = require('utils.resource')

const roleMiner = {
    run: (creep) => {
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            let container = resourceUtil.findClosestContainerOfSpawn(true)
            if (container) {
                if (creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, { visualizePathStyle: { stroke: '#fff' } })
                }
            }
        } else {
            let resource = resourceUtil.findClosestResourceOfSpawn()
            if (resource) {
                if (creep.harvest(resource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(resource, { visualizePathStyle: { stroke: '#fff' } })
                }
            }
        }
    }
}
module.exports = roleMiner