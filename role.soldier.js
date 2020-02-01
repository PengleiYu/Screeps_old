const roleSoldier = {
    run: function (creep) {
        const enemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
        if (enemy) {
            if (creep.attack(enemy) == ERR_NOT_IN_RANGE) {
                creep.moveTo(enemy, { visualizePathStyle: { stroke: '#fff' } })
            }
        } else {
            // 停靠在空地
            creep.moveTo(18, 25, { visualizePathStyle: { stroke: '#fff' } })
        }
    }
}
module.exports = roleSoldier