# Creacion de una extension utilizando GraphQL
## Repo Rename
### Github Command Line
#### Antonella García Alvarez
#### alu0101227610

### GraphQL

Es un lenguaje de consultas (query), y alteracion de la informacion de un servicio web. Es un medio de comunicacion entre nosotros y un servicio web (pagina web).
Nos facilita el trabajo solicitando al servicio web solo el objeto que necesitamos, sin averiguar donde estan a diferencia de como hemos accedidos a ellos antes con el JSON.

* Formato de las consultas

Para realizar un query o un mutation, la estructura sera algo parecido a esto:

```graphql
[query|mutation] nombre (argumentos) {
  Operacion
}
```
La operacion empieza cuando ponemos si la operacion es un query o un mutation. Lo siguiente sera el nombre de la operacion, y si queremos ponemos los argumentos que necesitaremos para trabajar. En este caso necesitamos el dueño u organizacion y el nombre del repositorio al que queremos acceder.

* Como implementar graphQL con Java Script

Para empezar, guardamos las variables que necesitamos en algo mas general. Es decir, en lugar de poner la organizacion la referenciamos. En nuestra extension, para conseguir el ID del repositorio, implementamos esta _query_ que guardamos en una variable getrepoID

```javascript
const getrepoID = (owner, name) => `
query getrepoID{
    repository(owner: "${owner}", name: "${name}"){
      id
    }
  }
 `;
```

Otra consultas que realizamos para el desarrollo de la extension rename es la de conseguir el nombre del repo, y en su defecto, cambiarlo:

```javascript
const renamerepo = (id, newName) => `   
  mutation renamerepo{
    updateRepository(input: 
      {
        name: "${newName}"
        repositoryId: "${id}"
      }
    ) {
      repository{
        name
      }
    }
  }
`;
```

Como vemos, esta consulta es una mutacion. Ya que altera el nombre del repositorio que le indiquemos; Para poder ejecutar estas consultas como siempre añadimos la libreria _shelljs_.

```javascript
const shell = require('shelljs')
```

Y luego, implementando un _shell.exec_ llamamos a la api de graphql a traves de github command line.

```javascript
r = shell.exec(`gh api graphql -f query='${renamerepo(ID, name)}' --jq '.data.updateRepository.repository.name'` , 
  {silent: true}
);

```

Lo que vemos al final de la llamada, es un _silent:true_. Sirve para que no se vea nada reflejado en la terminal, para limpiar un poco la ejecucion del codigo.

### Uso

Nuevamente, adjunto las opciones disponibles en nuestra extension que se ejecuta cuando la llamamos, o cuando ejecutamos la extension sin haber puesto los argumentos necesarios.

```bash
Usage: gh-repo-rename [options]

Options:
  -V, --version             output the version number
  -o, --org <organization>  specifies the organization
  -r, --repo <reponame>     specifies the repository
  -n, --name <name>         name
  -h, --help                display help for command

```
