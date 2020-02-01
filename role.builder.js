const roleBuilder = {
    run: function (creep) {
        if (creep.memory.building && creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            creep.memory.building = false
            creep.say('harveste')
        } else if (!creep.memory.building && creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            creep.memory.building = true
            creep.say('building')
        }

        if (creep.memory.building) {
            let siteList = creep.room.find(FIND_CONSTRUCTION_SITES)
            if (siteList.length) {
                let site = siteList[0]
                if (creep.build(site) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(site, { visualizePathStyle: { stroke: '#fff' } })
                }
            } else {
                // 停靠在空地
                creep.moveTo(18, 25, { visualizePathStyle: { stroke: '#fff' } })
            }
        } else {
            let resource = creep.room.find(FIND_SOURCES)[0]
            if (creep.harvest(resource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(resource, { visualizePathStyle: { stroke: '#fff' } })
            }
        }
    }
}

module.exports = roleBuilder