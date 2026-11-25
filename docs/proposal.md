# Waby — proposal actualizada

Actualiza la [proposal de 2024](https://github.com/utnfrrodsw/tp/pull/78) con el alcance de Waby 1.0, que es el que presentamos para aprobación directa. Respeta su estructura. Al final se lista qué cambió.

## Grupo

### Integrantes

- 47903 - Libera, Franco
- 51881 - Palamidessi, Elias Rene

### Repositorios

- [Fullstack app](https://github.com/Eliasusu/Fullstack-app-Waby): monorepo con la API, el client y el contrato compartido.

## Tema

### Descripción

Waby es para personas que ya entrenan calistenia o gimnasio. Cada usuario arma sus propios Ejercicios, los organiza en Entrenamientos, los planifica en un calendario y en Mesociclos, y sigue su sobrecarga progresiva con Metas.

### Modelo

El glosario y el modelo de dominio están en [`CONTEXT.md`](../CONTEXT.md). Las decisiones del modelo están en [ADR-0003](adr/0003-modelo-de-dominio-1-0.md) y en [ADR-0004](adr/0004-la-meta-pertenece-a-un-mesociclo.md) (la Meta pertenece a un Mesociclo).

Clases de negocio: Usuario, Método de entrenamiento, Grupo muscular, Ejercicio, Progresión, Mesociclo, Entrenamiento, Ítem de entrenamiento y Meta.

### Stack

- **Client:** React 18 + Vite + TypeScript, Tailwind y shadcn/ui.
- **API:** Node + Express + TypeScript, MikroORM sobre MySQL 8.
- **Contrato compartido:** paquete `@waby/shared` con los esquemas Zod, que validan la API y el client con las mismas reglas ([ADR-0002](adr/0002-paquete-shared-contrato-zod.md)).
- **Monorepo** con pnpm workspaces ([ADR-0001](adr/0001-monorepo-pnpm-workspaces.md)). La base se levanta con Docker Compose.

## Alcance funcional

### Alcance mínimo

| Req | Detalle |
|:-|:-|
| CRUD simple | 1. CRUD Usuario<br>2. CRUD Método de entrenamiento |
| CRUD dependiente | 1. CRUD Usuario {depende de} CRUD Método de entrenamiento |
| Listado + detalle | 1. Listado de Ejercicios filtrado por Grupo muscular<br>2. Listado de Mesociclos: al elegir uno se abre su detalle con sus Entrenamientos |
| CU/Epic | 1. Registrar usuario |

### Adicionales para aprobación

| Req | Detalle |
|:-|:-|
| CRUD (desde la app) | 1. CRUD Usuario (perfil)<br>2. CRUD Método de entrenamiento (admin)<br>3. CRUD Grupo muscular (admin)<br>4. CRUD Ejercicio<br>5. CRUD Entrenamiento e Ítems de entrenamiento<br>6. CRUD Mesociclo<br>7. CRUD Meta |
| CU/Epic | 1. Crear rutina para un Mesociclo (Franco Libera)<br>2. Registrar una Meta (Elias Palamidessi) |
| Niveles de acceso | Usuario y Admin. El Admin gestiona los catálogos (Métodos de entrenamiento y Grupos musculares). La API responde 403 si un Usuario intenta entrar a lo del Admin |

#### Relación entre los casos de uso

La Meta pertenece a un Mesociclo. Su progreso, la sobrecarga progresiva, no se carga a mano: es el mejor valor entre los Ítems completados del Ejercicio de la Meta en los Entrenamientos de ese Mesociclo. O sea, lo que registra "Crear rutina para un Mesociclo" es el input de "Registrar una Meta".

### Alcance adicional voluntario

| Req | Detalle |
|:-|:-|
| Otros | Entorno con Docker Compose, datos de demo (seed), tests de integración de la API y smoke tests e2e con Playwright |

## Cambios respecto de 2024

- **Meta en lugar de sobrecarga progresiva cargada a mano:** antes, la sobrecarga progresiva era un registro manual. Ahora es el progreso de una Meta y se deriva de los Ítems completados.
- **Mesociclo y Meta relacionados:** la Meta apunta a su Mesociclo ([ADR-0004](adr/0004-la-meta-pertenece-a-un-mesociclo.md)).
- **"Tipo entrenamiento" pasa a llamarse Método de entrenamiento** (Calistenia o Gimnasio). Junto con Grupo muscular, es un catálogo que administra el Admin.
- **Entrenadores y alumnos quedan afuera:** los niveles de acceso son Usuario y Admin.
- **Rutina** ya no es un término propio: se habla de Entrenamientos de un Mesociclo.
- **Progresiones:** existen en el modelo y en la API, pero no tienen pantalla en 1.0.
- **El listado filtra por Grupo muscular.** No filtra por Método de entrenamiento.
