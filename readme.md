## Preguntas ❓
- Como debo crear las entitys que dentro de ellas tienen otras entitys? Porque si dentro de una entity tengo una clase, a la hora de cargar datos, por los schemas, tengo que cargar o crear todos los datos de esa clase y la base de datos solo me pide el id de esa clase que está dentro de la clase. <br> Ejemplo: <br> En la clase o entity Exercises tengo dentro de ella Musclegroups, la bd solo me pide el id del Musclegroups para cargar un nuevo pero en el repository de exercise cuando valido los datos del exercise y llega a la parte de musclegroups, en la parte de schemas me explota todo, o bien porque le estoy pasando solo un string (id) y esperaba un objeto o visceversa 

## Mensajes para el proximo dev(esclavo) 📨

- Tenemos problemas con el ingreso de datos a la base de datos y nos está complicando la vida las validaciones

## ToDo 📃
<ul> 
<li>- [x] Al crear el repository la llamadas en las rutas por los diferentes metodos han cambiado, darle el formato correcto</li>
<li>- [x] Acomodar todos los schemas para que coincidan con entity</li>
<li>- [x] Hacer el repository de users</li>
<li>- [x] Acomodar Routes de users</li>
<li>- [x] Acomodar Routes trainings</li>
<li>- [x] Cambiar a un nombre mas apropiado para Routines</li>
<li>- [x] Quitar el objeto Training de la entidad Exercises y hacer los cambios correspondientes</li>
<li>- [x] Hacer repository y routes, agregar en index.ts de muscle group</li>
<li>- [x] Hacer repository y routes, agregar en index.ts de mesocycles</li>
<li>- [x] Hacer repository y routes, agregar en index.ts de trainings</li>
<li>- [x] Hacer repository y routes, agregar en index.ts de routines</li>
<li>- [x] Hacer repository y routes, agregar en index.ts de auth</li>
<li>- [x] Conectar base da datos</li>
<li>- [x] Cambiar routes, controller y repository para Muscle Groups</li>
<li>- [x] Cambiar routes, controller y repository para Mesocycles</li>
<details>
    <summary>Testear auth</summary>
        <ul>
            <li>- [x] Get alls</li>
            <li>- [x] Get one </li>
            <li>- [x] Create </li>
            <li>- [x] Update </li>
            <li>- [x] Delete </li>
        </ul>
</details>
<details>
    <summary>Testear users</summary>
        <ul>
            <li>- [x] Get alls</li>
            <li>- [x] Get one </li>
            <li>- [x] Create </li>
            <li>- [x] Update </li>
            <li>- [x] Delete </li>
        </ul>
</details>
<details>
    <summary>Testear exercises</summary>
        <ul>
            <li>- [x] Get alls</li>
            <li>- [x] Get one </li>
            <li>- [ ] Create </li>
            <li>- [ ] Update </li>
            <li>- [ ] Delete </li>
        </ul>    
</details>
<details>
    <summary>Testear trainings</summary>
        <ul>
            <li>- [ ] Get alls</li>
            <li>- [ ] Get one </li>
            <li>- [ ] Create </li>
            <li>- [ ] Update </li>
            <li>- [ ] Delete </li>
        </ul>
</details>
<details>
    <summary>Testear muscleGroups</summary>
        <ul>
            <li>- [ ] Get alls</li>
            <li>- [ ] Get one </li>
            <li>- [ ] Create </li>
            <li>- [ ] Update </li>
            <li>- [ ] Delete </li>
        </ul>
</details>
<details>
    <summary>Testear mesocycles</summary>
        <ul>
            <li>- [ ] Get alls</li>
            <li>- [ ] Get one </li>
            <li>- [ ] Create </li>
            <li>- [ ] Update </li>
            <li>- [ ] Delete </li>
        </ul>
</details>
<details>
    <summary>Testear exercises_trainings</summary>
        <ul>
            <li>- [ ] Get alls</li>
            <li>- [ ] Get one </li>
            <li>- [ ] Create </li>
            <li>- [ ] Update </li>
            <li>- [ ] Delete </li>
        </ul>
</details>
<li>- [ ] Hacer repository y routes, agregar en index.ts de index --> No se que íria dentro del index</li>
</ul>

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
