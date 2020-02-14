const resourceUtil = require('utils.resource')

const roleMiner = {
    run: (creep) => {
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            let container = resourceUtil.findClosestContainerOfScreep(creep,true)
            if (container) {
                if (creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, { visualizePathStyle: { stroke: '#fff' } })
                }
            }
        } else {
            let resource = resourceUtil.findClosestResourceOfSpawn()
            if (resource) {
                resourceUtil.harvestEnergyFromResource(creep, resource)
            }
        }
    }
}
module.exports = roleMiner