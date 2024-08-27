## Preguntas ❓

- Es mejor relacionar a los usuarios con los mesociclos y luego los mesociclos se relacionan con entrenamientos? Porque nosotros lo tenemos que los usuarios se relacionan con muchos entrenamientos y esos entrenamientos se relacionan con solo 1 mesociclo o otros

- Porque la entidad exercises_trainings no me deja ponerle otra clave primaria que no sea la de la entidad trainings?

- Porque cuando creo un training y le asigno un ejercicio no se me crea un exercise_training con las foraneas de estos 2?

- Porque no me aparacen las foraneas de progressionsSec y progressionsReps en Exercises?

## Mensajes para el proximo dev(esclavo) 📨

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
    <summary>Integrar ORM</summary>
    <ul>
        <li>- [x] Integrar Auth y Users </li>
        <li>- [x] Integrar trainings </li>
        <li>- [x] Integrar mesocycle </li>
        <li>- [x] Integrar trainingsMethods </li>
        <li>- [x] Integrar exercises </li>
        <li>- [x] Integrar MuscleGroups </li>
        <li>- [ ] Integrar exercises_trainings </li>\
    </ul>
</details>
<details>
    <summary>Testear auth</summary>
        <ul>
            <li>- [x] Create/Register </li>
            <li>- [x] Login </li>
            <li>- [x] Logout </li>
            <li>- [x] Protected route </li> 
        </ul>
</details>
<details>
    <summary>Testear users</summary>
        <ul>
            <li>- [x] Get alls</li>
            <li>- [x] Get one </li>
            <li>- [x] Update </li>
            <li>- [x] Delete </li>
        </ul>
</details>
<details>
    <summary>Testear exercises</summary>
        <ul>
            <li>- [x] Get alls</li>
            <li>- [x] Get one </li>
            <li>- [x] Create </li>
            <li>- [x] Update </li>
            <li>- [x] Delete </li>
        </ul> 
    <summary>Testear calisthenics progression</summary>
        <ul>
            <li>- [x] Get alls</li>
            <li>- [x] Get one </li>
            <li>- [x] Create </li>
            <li>- [x] Update </li>
            <li>- [x] Delete </li>
        </ul> 
    
</details>
<details>
    <summary>Testear trainings</summary>
        <ul>
            <li>- [x] Get alls</li>
            <li>- [x] Get one </li>
            <li>- [x] Create </li>
            <li>- [x] Update </li>
            <li>- [x] Delete </li>
        </ul>
</details>
<details>
    <summary>Testear muscleGroups</summary>
        <ul>
            <li>- [x] Get alls</li>
            <li>- [x] Get one </li>
            <li>- [x] Create </li>
            <li>- [x] Update </li>
            <li>- [x] Delete </li>
        </ul>
</details>
<details>
    <summary>Testear mesocycles</summary>
        <ul>
            <li>- [x] Get alls</li>
            <li>- [x] Get one </li>
            <li>- [x] Create </li>
            <li>- [x] Update </li>
            <li>- [x] Delete </li>
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
<summary>
 <li>- [ ]  Completar parte del login
- [ ]  Agregar que se muestren los errores en rojo en la parte del register y el login
- [ ]  Crear Dashboard o page Dashboard
    - [ ]  Colocar todos los componentes
    - [ ]  Cada vez que se toque algún componente ir a una página especifica por componente o analizar si se puede hacer que los componentes se abran como una ventana central de notion
- [ ]  Empezar a crear componentes
    - [ ]  Activity by month, weekly or year
    - [ ]  DayRoutine
        - [ ]  Posibilidad de hacer un CRUD en training y en TrainingsExercises, el componente debe funcionar usando un GET ONE mostrando el training del día de la fecha mas todos los objetos TrainingsExercises
    - [ ]  CalendarMesocycle by month (sigo pensando que no tiene sentido)
        - [ ]  Cada día será clickeable donde aparece la opción de crear un Training C o modificar el que este hecho (GET ONE Training by user loged and this mesocycle), o sea, poder hacer un CRUD
    - [ ]  Exercises/ Exercises filtred by muscle group / Exercises filtred by Training Method and muscle group
    - [ ]  Muscle group / Muscle group
        - [ ]  Dentro de cada tarjeta o box de muscle group debería haber un despliegue (GET ALL )de exercises donde si tocas algún Exercises podes hacer un CRUD
</summary>
</ul>

## Fechas de entregas 📅

TP

- [x] 8/4 -> Entregar enunciado del TP de Desarrollo y elegir CRUD de siguiente entrega.
- [x] 24/5 -> Desarrollar y entregar el código de 1 CRUD en back-end (en memoria, sin persistencia)
- [x] 28/6 -> Desarrollar y entregar el código de 1 CRUD x integrante en back-end COMPLETO (con acceso a BD incluido)
- [x] 28/6 -> Entregar boilerplate del front-end
- [x] 26/7 -> Desarrollar y entregar el código un GET ALL desde el front-end al back-end ya desarrollado antes (listar múltiples elementos de una colección).
- [ ] 23/8 -> Desarrollar y entregar 1 CRUD completo front-end + back-end (todas las operaciones de CRUD).
- [ ] 16/9 -> Desarrollar y entregar todos los CRUD front-end + back-end con alcance de regularidad.
- [ ] Durante octubre -> Terminar el TP de desarrollo front-end + backend con alcance de regularidad.
- [ ] Antes del 14 de Noviembre -> Defensa del TP desarrollo.
