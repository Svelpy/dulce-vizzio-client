export function getGreetingMessage(): string {
	const hour = new Date().getHours();

	let greeting = '';

	if (hour >= 5 && hour < 12) {
		const options = [
			'¡Buenos días',
			'¡Buen día',
			'¡Arriba, que hoy será un gran día',
			'¡A empezar con todo este día'
		];
		greeting = options[Math.floor(Math.random() * options.length)];
	} else if (hour >= 12 && hour < 18) {
		const options = [
			'¡Buenas tardes',
			'¡Qué tal va tu día',
			'¡Seguimos con todo esta tarde',
			'¡Aún queda mucho por lograr hoy'
		];
		greeting = options[Math.floor(Math.random() * options.length)];
	} else if (hour >= 18 && hour < 23) {
		const options = [
			'¡Buenas noches',
			'¡Cerrando el día con todo',
			'¡Excelente noche para avanzar',
			'¡Relájate, pero no te detengas'
		];
		greeting = options[Math.floor(Math.random() * options.length)];
	} else {
		const options = [
			'¡Trabajando hasta tarde',
			'¡Eres de los que no se rinden',
			'¡La noche también es productiva'
		];
		greeting = options[Math.floor(Math.random() * options.length)];
	}

	return greeting;
}
