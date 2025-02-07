from fastapi import FastAPI, status, Depends
import classes
import model
from database import engine, get_db
from sqlalchemy.orm import Session
import requests
from bs4 import BeautifulSoup
from typing import List
from fastapi.middleware.cors import CORSMiddleware

model.Base.metadata.create_all(bind=engine)
app = FastAPI()

origins = [
 'http://localhost:3000'
]
app.add_middleware(
 CORSMiddleware,
 allow_origins=origins,
 allow_credentials=True,
 allow_methods=['*'],
 allow_headers=['*']
)

@app.get("/")
def read_root():
    return {"Hello": "lala"}

@app.post("/criar", status_code=status.HTTP_201_CREATED)
def criar_valores(nova_mensagem: classes.Mensagem, db: Session = Depends(get_db)):
    # mensagem_criada = model.Model_Mensagem(titulo=nova_mensagem.titulo,
    # conteudo=nova_mensagem.conteudo, publicada=nova_mensagem.publicada)
    mensagem_criada = model.Model_Mensagem(**nova_mensagem.model_dump())
    db.add(mensagem_criada)
    db.commit()
    db.refresh(mensagem_criada)
    return {"Mensagem": mensagem_criada}

@app.get("/quadrado/{num}")
def square(num: int):
 return num ** 2

@app.get("/scraping")
def scraping(db: Session = Depends(get_db)):
    linhas = []
    links = []

    link = 'https://www.ufu.br'
    resposta = requests.get(link)
    
    if(resposta.status_code==200):
        soup = BeautifulSoup(resposta.content, 'html.parser')
        
    barra_esquerda = soup.find('ul', class_="sidebar-nav")
    
    linhas_barra_esquerda = barra_esquerda.find_all('li')
    linhas_barra_esquerda = linhas_barra_esquerda[30:]
    
    links_barra_esquerda = barra_esquerda.find_all('a')
    links_barra_esquerda = links_barra_esquerda[27:]

    
    
    def criar_valores(menuNav, linkNav, db):
        nova_mensagem = classes.UFU(
            menuNav=menuNav,
            link=linkNav
        )

        mensagem_criada = model.Model_ufu(**nova_mensagem.model_dump())
        db.add(mensagem_criada)
        db.commit()
        db.refresh(mensagem_criada)
    
    
    for linha, link in zip(linhas_barra_esquerda, links_barra_esquerda):
        menuNav = linha.text.replace("\n", "").replace("\t", "").strip()
        linkNav = "https://ufu.br" + link.get('href').replace("\n", "").replace("\t", "").strip()
        
        criar_valores(menuNav, linkNav,db)
    

    
        

    return "Scraping criado e armazenado!"

@app.get("/mensagens", response_model=List[classes.Mensagem], status_code=status.HTTP_200_OK)
async def buscar_valores(db: Session = Depends(get_db), skip: int = 0, limit: int=100):
 mensagens = db.query(model.Model_Mensagem).offset(skip).limit(limit).all()
 return mensagens