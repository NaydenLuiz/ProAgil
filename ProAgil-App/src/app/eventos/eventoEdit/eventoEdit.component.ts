import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Evento } from 'src/app/_models/Evento';
import { EventoService } from 'src/app/_services/evento.service';

@Component({
  selector: 'app-evento-edit',
  templateUrl: './eventoEdit.component.html',
  styleUrls: ['./eventoEdit.component.scss']
})
export class EventoEditComponent implements OnInit {

  titulo = 'Editar Evento';
  evento: Evento = new Evento();
  imagemUrl = 'assets/img/upload.png';
  registerForm: FormGroup;
  file: File;
  fileNameToUpdate: string;

  dataAtual = '';

  get lotes(): FormArray {
    return <FormArray>this.registerForm.get('lotes');
  }

  get redesSociais(): FormArray {
    return <FormArray>this.registerForm.get('redesSociais');
  }


  constructor(private eventoService: EventoService
    , private modalService: BsModalService
    , private fb: FormBuilder
    , private localeService: BsLocaleService
    , private toastr: ToastrService
    , private router: ActivatedRoute
    ) 
    {
      this.localeService.use('pt-br');
      
    }


    ngOnInit() {
      this.validation();
      this.carregarEvento();
     }
i
     carregarEvento() {
      const idEvento = +this.router.snapshot.paramMap.get('id');
      this.eventoService.getEventoById(idEvento)
        .subscribe(
          (evento: Evento) => {
            this.evento = Object.assign({}, evento);
            this.fileNameToUpdate = evento.imagemUrl.toString();
  
            this.imagemUrl = `http://localhost:5000/resources/images/${this.evento.imagemUrl}?_ts=${this.dataAtual}`;
  
            this.evento.imagemUrl = '';
            this.registerForm.patchValue(this.evento);
  
            this.evento.lotes.forEach(lote => {
              this.lotes.push(this.criaLote(lote));
            });
            this.evento.redeSociais.forEach(redeSocial => {
              this.redesSociais.push(this.criaRedeSocial(redeSocial));
            });
          }
        );
    }

     validation(){
      this.registerForm = this.fb.group({
        id:[],
        tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
        local: ['', Validators.required],
        dataEvento: ['', Validators.required],
        qtdPessoas: ['', [Validators.required ,Validators.max(12000)]],
        telefone: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        imagemUrl: [''],
        lotes: this.fb.array([]),
        redesSociais: this.fb.array([])
      });
    }
    criaLote(lote: any): FormGroup {
      return this.fb.group({
        id: [lote.id],
        nome: [lote.nome, Validators.required],
        quantidade: [lote.quantidade, Validators.required],
        preco: [lote.preco, Validators.required],
        dataInicio: [lote.dataInicio],
        dataFim: [lote.dataFim]
      });
    }
  
    criaRedeSocial(redeSocial: any): FormGroup {
      return this.fb.group({
        id: [redeSocial.id],
        nome: [redeSocial.nome, Validators.required],
        url: [redeSocial.url, Validators.required]
      });
    }
  
    adicionarLote() {
      this.lotes.push(this.criaLote({ id: 0 }));
    }
  
    adicionarRedeSocial() {
      this.redesSociais.push(this.criaRedeSocial({ id: 0 }));
    }
  
    removerLote(id: number) {
      this.lotes.removeAt(id);
    }
  
    removerRedeSocial(id: number) {
      this.redesSociais.removeAt(id);
    }
  
    onFileChange(evento: any, file: FileList) {
      const reader = new FileReader();
  
      reader.onload = (event: any) => this.imagemUrl = event.target.result;
  
      this.file = evento.target.files;
      reader.readAsDataURL(file[0]);
    }
  
    salvarEvento() {
      this.evento = Object.assign({ id: this.evento.id }, this.registerForm.value);
      this.evento.imagemUrl = this.fileNameToUpdate;
  
      this.uploadImagem();
  
      this.eventoService.putEvento(this.evento).subscribe(
        () => {
          this.toastr.success('Editado com Sucesso!');
        }, error => {
          this.toastr.error(`Erro ao Editar: ${error}`);
        }
      );
    }
  
    uploadImagem() {
      if (this.registerForm.get('imagemUrl').value !== '') {
        this.eventoService.postUpload(this.file, this.fileNameToUpdate)
          .subscribe(
            () => {
              this.dataAtual = new Date().getMilliseconds().toString();
              this.imagemUrl = `http://localhost:5000/resources/images/${this.evento.imagemUrl}?_ts=${this.dataAtual}`;
            }
          );
      }
    }

}
