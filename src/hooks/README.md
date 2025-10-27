# hooks — Hooks personalizados (detallado)

Este fichero explica cómo diseñar hooks reutilizables, patrones de error/reintento, testing y un ejemplo completo de `useAlerts`.

Principios
- Un hook debe encapsular una responsabilidad clara: fetching, sincronización, validación.
- Nombre: `useXxx` (ej. `useAlerts`).
- Hooks no condicionales: respetar las reglas de hooks de React.
- Evitar efectos secundarios no controlados; devolver funciones para operaciones (ej. `refresh()`, `retry()`).

Patrones recomendados
- Data fetching: separar `fetcher` (utils/apiClient) del hook para facilitar test y mocking.
- Polling: usar `setInterval` o `useSWR`/`react-query` según preferencia; implementar backoff en errores.
- Error handling: exponer `error` y `status` (`idle | loading | success | error`).

Ejemplo completo: `useAlerts.ts`

```ts
import { useEffect, useState, useRef, useCallback } from 'react';
import apiClient from 'utils/apiClient';

export interface Alert { id: string; type: string; message: string; timestamp: string }

export function useAlerts(pollInterval = 60_000) {
	const [data, setData] = useState<Alert[]>([]);
	const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');
	const [error, setError] = useState<Error | null>(null);
	const mounted = useRef(true);

	const fetchAlerts = useCallback(async () => {
		setStatus('loading');
		setError(null);
		try {
			const res = await apiClient.get<Alert[]>('/alerts');
			if (!mounted.current) return;
			setData(res.data);
			setStatus('success');
		} catch (err: any) {
			if (!mounted.current) return;
			setError(err);
			setStatus('error');
		}
	}, []);

	useEffect(() => {
		mounted.current = true;
		fetchAlerts();
		const id = setInterval(fetchAlerts, pollInterval);
		return () => {
			mounted.current = false;
			clearInterval(id);
		};
	}, [fetchAlerts, pollInterval]);

	// Exponer utilidades
	return {
		data,
		status,
		error,
		refresh: fetchAlerts
	} as const;
}
```

Testing
- Mockear llamadas con `msw` y escribir tests que cubran:
	- respuesta exitosa
	- error y reintento
	- polling behaviour (usar timers `jest.useFakeTimers()`)

Ejemplo de test (esqueleto)

```ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useAlerts } from './useAlerts';
import { server, rest } from 'msw';

// configurar msw handlers en setupTests

test('fetches alerts and exposes them', async () => {
	const { result, waitForNextUpdate } = renderHook(() => useAlerts(1000));
	await waitForNextUpdate();
	expect(result.current.status).toBe('success');
	expect(Array.isArray(result.current.data)).toBe(true);
});
```

Buenas prácticas
- Exponer `refresh()` en hooks para permitir control manual desde la UI.
- Evitar que hooks hagan demasiadas suposiciones sobre shape de datos; transformar en el hook si es necesario.

