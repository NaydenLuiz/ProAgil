using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using ProAgil.Domain;
using ProAgil.Repository;
using ProAgil.WebAPI.Dtos;

namespace ProAgil.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventoController : ControllerBase
    {
        private readonly IProAgilRepository _repo;
        private readonly IMapper _mapper;
        public EventoController(IProAgilRepository repo,IMapper mapper)
        {
            _mapper =mapper;
            _repo = repo;
        }

        // GET api/values
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var eventos =await _repo.GetAllEventoAsync(true);
                var results = _mapper.Map<EventoDto[]>(eventos);
                return Ok(results);
            }catch(System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,$"Banco Dados Falhou {ex.Message}");
            }
           
        }
       
        [HttpPost("upload")]
        public async Task<IActionResult> Upload()
        {
            try
            {
                var file = Request.Form.Files[0];
                var folderName = Path.Combine("Resources","Images");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                if (file.Length > 0)
                {
                    var filename = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName;
                    var fullPath = Path.Combine(pathToSave, filename.ToString().Replace("\\"," ").Trim());

                    using(var stream = new FileStream(fullPath,FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }

                }
                return Ok();
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Banco Dados Falhou {ex.Message}");
            }
            return BadRequest("Erro ao tentar realizar upload");
        }
        // GET api/values
        [HttpGet("{EventoId}")]
        public async Task<IActionResult> Get(int EventoId)
        {
            try
            {
                var evento =await _repo.GetEventoAsyncById(EventoId,true);
                var results = _mapper.Map<EventoDto>(evento);
                return Ok(results);
            }catch(System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,"Banco Dados Falhou");
            }
           
        }
        // GET api/values
        [HttpGet("getByTema{Tema}")]
        public async Task<IActionResult> Get(string tema)
        {
            try
            {
                var eventos =await _repo.GetAllEventoAsyncByTema(tema,true);
                  
                var results = _mapper.Map<EventoDto[]>(eventos);
                return Ok(results);
            }catch(System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,"Banco Dados Falhou");
            }
           
        }


        [HttpPost]
        public async Task<IActionResult> Post([FromBody]EventoDto model)
        {
            if(!ModelState.IsValid){
                return this.StatusCode(StatusCodes.Status400BadRequest,ModelState);
            }
            try
            {
                var evento = _mapper.Map<Evento>(model);

                _repo.Add(evento);

                if (await _repo.SaveChangesAsync())
                {
                    return Created($"/api/evento/{model.Id}", _mapper.Map<EventoDto>(evento));
                }
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                    $"Banco Dados Falhou {ex.Message}");
            }

            return BadRequest();
        }

        
        [HttpPut("{EventoId}")]
        public async Task<IActionResult> Put(int EventoId,Evento model)
        {
            try
            {
                var evento = await _repo.GetEventoAsyncById(EventoId,false);
                if(evento==null){
                   return NotFound();
               }else
               {
                   _mapper.Map(model,evento);
                   _repo.Update(evento);
               }
               if(await _repo.SaveChangesAsync())
               {
                 return Created($"/api/evento/{model.Id}", _mapper.Map<EventoDto>(evento));
               }
               
            }catch(System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,"Banco Dados Falhou");
            }

           return BadRequest();
        }


         [HttpDelete("{EventoId}")]
        public async Task<IActionResult> Delete(int EventoId)
        {
            try
            {
                var evento = await _repo.GetEventoAsyncById(EventoId,false);
                if(evento==null){
                   return NotFound();
               }else
               {
                   _repo.Delete(evento);
               }
               if(await _repo.SaveChangesAsync())
               {
                 return Ok();
               }
               
            }catch(System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,"Banco Dados Falhou");
            }

           return BadRequest();
        }
    }
}