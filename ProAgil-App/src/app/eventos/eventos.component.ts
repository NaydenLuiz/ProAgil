import { Component, OnInit,TemplateRef } from '@angular/core';
import { EventoService } from '../_services/evento.service';
import { Evento } from '../_models/Evento';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import {defineLocale} from 'ngx-bootstrap/chronos';
import {ptBrLocale} from 'ngx-bootstrap/locale';
import {BsLocaleService} from 'ngx-bootstrap/datepicker';
import {ToastrService} from 'ngx-toastr';

defineLocale('pt-br',ptBrLocale);
@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css'],
})
export class EventosComponent implements OnInit {

  titulo = 'Eventos';
  eventosFiltrados: Evento[];
  eventos: Evento[];
  evento: Evento;
  modoSalvar ='post';
  bodyDeletarEvento = '';
  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
 
  registerForm: FormGroup;
  file: File;
  _filtroLista: string = '';
  fileNameToUpdate: string;
  dataAtual: string;
  constructor(private eventoService: EventoService
            , private modalService: BsModalService
            , private fb: FormBuilder
            , private localeService: BsLocaleService
            , private toastr: ToastrService
            ) 
            {
              this.localeService.use('pt-br');
            }
  get filtroLista(): string{
    return this._filtroLista;
  }
  set filtroLista(value: string){
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  editarEvento(evento: Evento, template: any)
  {
    this.modoSalvar = 'put';
    this.openModal(template);
    this.evento = Object.assign({}, evento);
    this.fileNameToUpdate = evento.imagemUrl.toString();
    this.evento.imagemUrl = '';
    this.registerForm.patchValue(this.evento);
  }
  novoEvento(template: any){
    this.modoSalvar = 'post';
    this.openModal(template);
  }
  // tslint:disable-next-line: typedef
  openModal(template: any){
    this.registerForm.reset();
    template.show();
  }




  ngOnInit() {
   this.validation();
   this.getEventos();
  }
  filtrarEventos(filtrarPor: string): Evento[]{
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter
    (
      evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }
  alternarImagem()
  {
    this.mostrarImagem = !this.mostrarImagem;
  }

  validation(){
    this.registerForm = this.fb.group({
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required ,Validators.max(12000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      imagemUrl: ['', Validators.required]

    });
  }

  onFileChange(event){
   const reader = new FileReader();
   if(event.target.files && event.target.files.length)
   {
      this.file = event.target.files;
      console.log(this.file);
   }
  }
  // tslint:disable-next-line: typedef
  uploadImagem()
  {
    if (this.modoSalvar === 'post')
    {
      const nomeArquivo = this.evento.imagemUrl.split('\\', 3);
      this.evento.imagemUrl = nomeArquivo[2];
      this.eventoService.postUpload(this.file,nomeArquivo[2])
      .subscribe(
        () => {
          this.dataAtual  = new Date().getMilliseconds().toString();
          this.getEventos();
        }
      );
    }else
    {
      this.evento.imagemUrl = this.fileNameToUpdate;
      this.eventoService.postUpload(this.file, this.fileNameToUpdate)
      .subscribe(
        () => {
          this.dataAtual  = new Date().getMilliseconds().toString();
          this.getEventos();
        }
      );
    }
  }
 // tslint:disable-next-line: typedef
  salvarAlteracao(template: any)
  {
    if (this.registerForm.valid)
    {
      if(this.modoSalvar === 'post')
      {
          this.evento = Object.assign({}, this.registerForm.value);
          this.uploadImagem();
          this.eventoService.postEvento(this.evento).subscribe(
            (novoEvento: Evento) =>{
                console.log(novoEvento);
                template.hide();
                this.getEventos();
                this.toastr.success('Inserido com sucessso');
            }, error => {
              this.toastr.error(`Erro ao tentar Inserir:${error}`);
              console.log(error);
            }
          );

      }else
      {
          this.evento = Object.assign({id: this.evento.id}, this.registerForm.value);

          this.uploadImagem();

          this.eventoService.putEvento(this.evento).subscribe(
            () =>{
                template.hide();
                this.getEventos();
                this.toastr.success('Ediatdo com sucessso');
            }, error => {
              console.log(error);
              this.toastr.error(`Erro ao tentar Editar:${error}`);
            }
          );
      }
    }
  }
  getEventos() {
    this.eventoService.getAllEventos().subscribe(
      (_eventos: Evento[]) => {
        this.eventos = _eventos;
        this.eventosFiltrados = this.eventos;
        console.log(_eventos);
      },
      error => {
        console.log(error);
        this.toastr.error(`Erro ao tentar Carregar Eventos:${error}`);
      }
    );
  }
  excluirEvento(evento: Evento, template: any) {
    this.openModal(template);
    this.evento = evento;
    this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.tema}, Código: ${evento.tema}`;
  }

  confirmeDelete(template: any) {
    this.eventoService.deleteEvento(this.evento.id).subscribe(
      () => {
          template.hide();
          this.getEventos();
          this.toastr.success('Deletado com sucessso');
        }, error => {
          this.toastr.error(`Erro ao tentar Apagar:${error}`);
          console.log(error);
        }
    );
  }
}

