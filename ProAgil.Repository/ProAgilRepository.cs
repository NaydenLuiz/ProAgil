using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProAgil.Domain;

namespace ProAgil.Repository
{
    public class ProAgilRepository : IProAgilRepository
    {
        public DataContext _context { get; set; }
        public ProAgilRepository(DataContext context)
        {
            _context=context;
            _context.ChangeTracker.QueryTrackingBehavior= QueryTrackingBehavior.NoTracking;
        }

        //Gerais
        public void Add<T>(T entity) where T : class
        {
           _context.Add(entity);
        }
         public void Update<T>(T entity) where T : class
        {
            _context.Update(entity);
        }
        public void Delete<T>(T entity) where T : class
        {
           _context.Remove(entity);
        }
         public void DeleteRange<T>(T[] entityArray) where T : class
        {
           _context.RemoveRange(entityArray);
        }

          public async Task<bool> SaveChangesAsync()
        {
           return (await  _context.SaveChangesAsync())>0;
        }

       
        //Eventos
        public async Task<Evento[]> GetAllEventoAsync(bool includePalestrantes=false)
        {
            IQueryable<Evento> query =_context.Eventos
                                     .Include(x=>x.Lotes)
                                     .Include(x=>x.RedeSociais);
            if(includePalestrantes)
            {
                query = query
                .Include(x=>x.PalestrantesEventos)
                .ThenInclude(x=>x.Palestrante);
            }
            query = query
            .AsNoTracking()
            .OrderByDescending(x=>x.Id);
            return await query.ToArrayAsync();
        }

        public async Task<Evento> GetEventoAsyncById(int EventoId, bool includePalestrantes)
        {
           IQueryable<Evento> query =_context.Eventos
                                     .Include(x=>x.Lotes)
                                     .Include(x=>x.RedeSociais);
            if(includePalestrantes)
            {
                query = query
                .Include(x=>x.PalestrantesEventos)
                .ThenInclude(x=>x.Palestrante);
            }
            query = query
                    .AsNoTracking()
                    .OrderBy(x=>x.Id)
                    .Where(x=>x.Id==EventoId);
            return await query.FirstOrDefaultAsync();
        }

        public async Task<Evento[]> GetAllEventoAsyncByTema(string tema, bool includePalestrantes)
        {
           
            IQueryable<Evento> query =_context.Eventos
                                     .Include(x=>x.Lotes)
                                     .Include(x=>x.RedeSociais);
            if(includePalestrantes)
            {
                query = query
                .Include(x=>x.PalestrantesEventos)
                .ThenInclude(x=>x.Palestrante);
            }
            query = query
                    .AsNoTracking()
                    .OrderByDescending(x=>x.DataEvento)
                    .Where(x=>x.Tema.ToLower().Contains(tema.ToLower()));
            return await query.ToArrayAsync();
        }

        public async Task<Palestrante> GetPalestrantesAsync(int PalestranteId, bool includeEvento=false)
        {
            IQueryable<Palestrante> query =_context.Palestrantes
                                     .Include(x=>x.RedesSociais);

            if (includeEvento)
            {
                query = query
                .Include(pe => pe.PalestranteEventos)
                .ThenInclude(p => p.Evento);
            }

            query = query
                    .AsNoTracking()
                    .OrderBy(c => c.Nome)
                    .Where(p =>p.Id==PalestranteId);
            return await query.FirstOrDefaultAsync();
        }

        public async Task<Palestrante[]> GetAllPalestrantesAsyncByName(string name,bool includeEvento)
        {
            IQueryable<Palestrante> query = _context.Palestrantes
                                    .Include(x => x.RedesSociais);

            if (includeEvento)
            {
                query = query
                .Include(pe => pe.PalestranteEventos)
                .ThenInclude(p => p.Evento);
            }

            query = query
                    .AsNoTracking()
                    .Where(p => p.Nome.ToLower().Contains(name.ToLower()));
            return await query.ToArrayAsync();
        }

      
    }
}