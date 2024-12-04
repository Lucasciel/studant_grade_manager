import http from 'http' // módulo nativo do Node.js, usado para criar servidores HTTP
import {v4} from 'uuid'
const port = 3111 //porta que o servidor executa requisições


const grades = [
    {
        studentName: 'Lucas',
        subject: 'Portugues',
        grade: '8',
    },
];

//usando o modulo importado http, criamos o servidor
//dentro do servidor é API
const server = http.createServer((request, response)=> {
    const {method, url} = request
    let body = "";

    //data=dados chunk= nome aleatorio que representa dados recebidos
    //se requisição tiver dados, tranforma od dados em string e armazena em body
    request.on('data', (chunk)=> {
        body += chunk.toString();
    });

    //só execura quando todos os dados da requisição foram recebidos
    request.on('end', ()=> {
        const id = url.split('/')[2];

        //se a url da requisição tiver em /grades com metodo POST
        if (url==="/grades" && method == 'GET') {
        
        //resposta da requisição GET é nossa lista em json
        response.writeHead(200, {'Content-Type': 'application/json'}) //status da resposta
        response.end(JSON.stringify(grades))//Envia a lista de grades como resposta no formato JSON.

    } 
    //Tratando a requisição POST
    else if (url === "/grades" && method === "POST"){
        const {studentName, subject, grade} = JSON.parse(body)//de json para objeto
        const newGrade = {id: v4(),studentName, subject, grade} //cria novo objeto
        grades.push(newGrade) //adiciona nova lista à grades

        response.writeHead(201, {'Content-Type': 'application/json'}) //201 (que significa "Criado")
        response.end(JSON.stringify(newGrade)) //Envia a nova nota criada de volta ao cliente como uma resposta no formato JSON.
    }
    // /grades/ serve para poder selecionar todos
    else if (url.startsWith("/grades/") && method === "PUT") {
        const {studentName, subject, grade} = JSON.parse(body)
        const gradeToUpdate = grades.find(g=> g.id === id)

        if (gradeToUpdate) {
            gradeToUpdate.studentName = studentName;
            gradeToUpdate.subject = subject;
            gradeToUpdate.grade = grade;
            response.writeHead(200, { "Content-Type": "application/json" });
            response.end(JSON.stringify(gradeToUpdate));
        } else {
            response.writeHead(404, { "Content-Type": "application/json" });
            response.end(JSON.stringify({ message: "Grade not found" }));
        }
    }
    //deletar
    else if(url.startsWith("/grades/") && method === "DELETE") {
        const index = grades.findIndex(g=> g.id === id)

        if (index !== -1) {
            grades.splice(index, 1);
            response.writeHead(204);
            response.end();
          } else {
            response.writeHead(404, { "Content-Type": "application/json" });
            response.end(JSON.stringify({ message: "Grade not found" }));
          }
    }
    
    //Tratando rotas não encontradas (404):
    else {
        response.writeHead(404, {'Content-Type': 'application/json'});
        response.end(JSON.stringify({message: 'Route not found'}))
    }
    })

    
});

//Inicia o servidor e faz com que ele escute as requisições na porta definida.
server.listen(port, ()=> {
    console.log(`server rodando na porta ${port}`)
})

