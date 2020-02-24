const resourceUtil = require('utils.resource')

const roleMiner = {
    run: (creep) => {
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            let container = resourceUtil.findClosestEmptyContainerOfScreep(creep, STRUCTURE_CONTAINER)
            if (container) {
                if (creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, { visualizePathStyle: { stroke: '#fff' } })
                }
            }
        } else {
            let droppedResource =
                //  creep.pos.findClosestByRange([creep.pos])
                //   creep.pos.findInRange(FIND_DROPPED_RESOURCES,0)
                creep.room.find(FIND_DROPPED_RESOURCES, {
                    filter: it => it.pos.isEqualTo(creep.pos)
                    // console.log(it.pos.isEqualTo(creep.pos))
                    // it.pos == creep.pos
                })
            console.log(">>>", JSON.stringify(droppedResource))
            if (droppedResource.length) {
                console.log(creep.pickup(droppedResource[0]))
                // if (creep.pickup(droppedResource) == ERR_NOT_IN_RANGE) {
                //     creep.moveTo(droppedResource, { visualizePathStyle: { stroke: '#fff' } })
                // }
            }
            let resource = resourceUtil.findClosestResourceOfSpawn()
            if (resource) {
                resourceUtil.harvestEnergyFromResource(creep, resource)
            }
        }
    }
}
module.exports = roleMiner