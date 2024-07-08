## Preguntas ❓

- Puedo agregar sub carpetas dentro de schemas, models, controllers para separar Calistenia de gimnsasio?
- Si yo tengo ejercicios de calistenia que tienen progresiones que pueden ser de repeticiones o segundos. A la hora de cargar una meta de calistenia, la subclase 'Meta calistenia' ¿Debería bifurcarla por 'Meta calistenia seg' y 'Meta calistenia rep'? (Fuera del alcance por el momento)

## Mensajes para el proximo dev(esclavo) 📨

- La unica ruta que esta mal y tira errores es trainings y users
- Los schemas ahora coinciden con las entitys
- El CRUD de exercises ya funciona

## ToDo 📃

- [x] Al crear el repository la llamadas en las rutas por los diferentes metodos han cambiado, darle el formato correcto
- [x] Acomodar todos los schemas para que coincidan con entity
- [x] Hacer el repository de users
- [x] Acomodar Routes de users
- [x] Crear un sanitize input de exercise
- [ ] Crear un Get by muscle group en 'api\routes\exercises.routes.ts'
- [ ] Hacer repository y routes, agregar en index.ts de muscle group
- [ ] Hacer repository y routes, agregar en index.ts de mesocycles
- [ ] Hacer repository y routes, agregar en index.ts de trainings
- [ ] Hacer repository y routes, agregar en index.ts de routines
- [ ] Hacer repository y routes, agregar en index.ts de auth
- [ ] Hacer repository y routes, agregar en index.ts de index
- [ ] Conectar base da datos
- [ ] Cambiar los accesos a base de datos de todas las entidades en routes y repository

## Fechas de entregas 📅

TP

- [x] 8/4 -> Entregar enunciado del TP de Desarrollo y elegir CRUD de siguiente entrega.
- [x] 24/5 -> Desarrollar y entregar el código de 1 CRUD en back-end (en memoria, sin persistencia)
- [x] 28/6 -> Desarrollar y entregar el código de 1 CRUD x integrante en back-end COMPLETO (con acceso a BD incluido)
- [x] 28/6 -> Entregar boilerplate del front-end
- [ ] 26/7 -> Desarrollar y entregar el código un GET ALL desde el front-end al back-end ya desarrollado antes (listar múltiples elementos de una colección).
- [ ] 23/8 -> Desarrollar y entregar 1 CRUD completo front-end + back-end (todas las operaciones de CRUD).
- [ ] 16/9 -> Desarrollar y entregar todos los CRUD front-end + back-end con alcance de regularidad.
- [ ] Durante octubre -> Terminar el TP de desarrollo front-end + backend con alcance de regularidad.
- [ ] Antes del 14 de Noviembre -> Defensa del TP desarrollo.
