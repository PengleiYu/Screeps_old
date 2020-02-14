const roleUpgrader = require('role.upgrader')
const roleHarvester = require('role.harvester')
const roleBuilder = require('role.builder')
const roleSoldier = require('role.soldier')
const roleRepairer = require('role.repairer')
const roleMiner = require('role.miner')
const roleTranfer = require('role.transfer')

const ROLE_UPGRADER = 'upgrader'
const ROLE_HARVESTER = 'harvester'
const ROLE_BUILDER = 'builder'
const ROLE_SOLDIER = 'soldier'
const ROLE_REPAIRER = 'repairer'
const ROLE_MINER = 'miner'
const ROLE_TRANSFER='transfer'

const ROLE_WHICH_LOG = ROLE_UPGRADER

class Role {
	constructor(role, body, script, max, waitMax = false) {
		this.role = role
		this.body = body
		this.script = script
		this.max = max
		this.waitMax = waitMax
		this.spawnOpts = {
			memory: {
				role: this.role,
			},
// 			directions: [BOTTOM],
			dryRun: false,
		}
	}
	// 不能直接持有Spawn，似乎每个tick全局变量都会重建
	// 若直接持有全局变量，会导致在新的tick中持有的是旧tick中的变量
	getSpawn() {
		return Game.spawns['Spawn1']
	}
	createIfNeed(list) {
		let spawn = this.getSpawn()
		this.log(`createIfNeed: len=${list.length},max=${this.max}`)
		if (list.length < this.max) {
			let couldSpawn = roleCouldSpawn(this)
			this.log(`not max, couldSpawn=${couldSpawn}`)
			if (spawn.spawning || !couldSpawn) {
				this.log(`spawning=${spawn.spawning},couldSpawn=${couldSpawn}`)
				return
			}
			let name = '' + this.role + Game.time
			this.spawnOpts.dryRun = true//todo dryRun不检查container中的能量
			let code = spawn.spawnCreep(this.body, name, this.spawnOpts)
			this.log(`dryRun spawn a new creep: ${name}, code=${code}`)
			if (code == OK) {
				this.spawnOpts.dryRun = false
				spawn.spawnCreep(this.body, name, this.spawnOpts)
			}
		}
	}

	play() {
		this.log('play')
		let creepList = _.filter(Game.creeps, (creep) => creep.memory.role == this.role)

		this.createIfNeed(creepList)
		for (let creep of creepList) {
			this.script.run(creep)
		}
	}
	logDebugRole(msg) {
		if (this.role == ROLE_WHICH_LOG) {
			this.log(msg)
		}
	}
	log(msg) {
		console.log(`Role ${this.role}\t: ${msg}`)
	}
}

const LITTLE_BODY = [WORK, CARRY, MOVE]
const MEDIUM_BODY = [WORK, WORK, CARRY, CARRY, MOVE, MOVE]

const HARVESTER_BODY = [CARRY, CARRY, WORK, MOVE, MOVE]
const MINER_BODY = [WORK, WORK, WORK,WORK, CARRY, MOVE]
const UPGRADER_BODY = LITTLE_BODY
const BUILDER_BODY = LITTLE_BODY
const SOLDIER_BODY = [MOVE, MOVE, TOUGH, TOUGH, TOUGH, ATTACK]
const REPAIRER_BODY = MEDIUM_BODY

const roleList = [
    new Role(ROLE_HARVESTER, HARVESTER_BODY, roleHarvester, 1),    	
    new Role(ROLE_MINER, MINER_BODY, roleMiner, 1),
    new Role(ROLE_TRANSFER, HARVESTER_BODY, roleTranfer, 1),    	
	new Role(ROLE_BUILDER, BUILDER_BODY, roleBuilder, 1),
	new Role(ROLE_UPGRADER, UPGRADER_BODY, roleUpgrader, 1),
	new Role(ROLE_REPAIRER, REPAIRER_BODY, roleRepairer, 1),
	// new Role(ROLE_SOLDIER, SOLDIER_BODY, roleSoldier, 3, true),
]

// 是否可以spawn该role；用于控制role创建顺序
function roleCouldSpawn(roleToSpawn) {
	// let roles = roleList.map((it) => it.role)
	// console.log(`roleList: ${roles}`)
	for (var role of roleList) {
		if (role.role == roleToSpawn.role) {
			return true
		}
		let roleObject = _.filter(Game.creeps, (creep) => creep.memory.role == role.role)
		if (!(roleObject && roleObject.length >= role.max)) {
			return false
		}
	}
}

module.exports.loop = function () {
	for (let name in Memory.creeps) {
		if (!Game.creeps[name]) {
			delete Memory.creeps[name]
			console.log(name + '已死亡，删除记忆')
		}
	}

	console.log('loop')
	for (let role of roleList) {
		role.play()
	}
}