export const getEnvVariable = (key: string): string => {
	const value = import.meta.env[key];
	if (!value) {
		throw new Error(`La variable de entorno ${key} no está definida`);
	}
	return value;
};
