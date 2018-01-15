export default {
	generateId: (max = 1e15) => Math.abs(~~(Math.random() * max))
}