using System.Threading.Tasks;
using ProAgil.Domain;

namespace ProAgil.Repository
{
    public interface IProAgilRepository
    {
         void Add<T>(T entity) where T : class;
         void Update<T>(T entity) where T : class;
         void Delete<T>(T entity) where T : class;
         void DeleteRange<T>(T[] entityArray) where T : class;
        Task<bool> SaveChangesAsync();

         //EVENTOS
         Task<Evento[]> GetAllEventoAsyncByTema(string tema,bool includePalestrantes);
         Task<Evento[]> GetAllEventoAsync(bool includePalestrantes);
         Task<Evento> GetEventoAsyncById(int EventoId,bool includePalestrantes);

         //PALESTRANTE
          Task<Palestrante[]> GetAllPalestrantesAsyncByName(string name,bool includeEvento);
          Task<Palestrante> GetPalestrantesAsync(int PalestranteId,bool includeEvento);


    }
}