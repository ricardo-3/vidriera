// Coordenadas normalizadas, observadas sobre las imágenes WebP finales.
// La capa se ajusta al rectángulo visible de la imagen, conservando su encuadre.
export const HOTSPOTS={
 'IMG-02':[{x:.18,y:.26,label:'Materiales y altura'},{x:.49,y:.58,label:'Acceso central'},{x:.18,y:.73,label:'Vidriera y producto'}],
 'IMG-01':[{x:.14,y:.49,label:'Los departamentos'},{x:.53,y:.76,label:'Circulación e isla'},{x:.61,y:.40,label:'Caja y probadores'}],
 'IMG-14':[{x:.26,y:.67,label:'Primera dirección'},{x:.41,y:.39,label:'El fondo del local'},{x:.61,y:.75,label:'Punto de interés'}],
 'IMG-17':[{x:.49,y:.73,label:'Grupo protagonista'},{x:.56,y:.49,label:'Alturas y apoyos'},{x:.73,y:.81,label:'Espacio entre grupos'}],
 'IMG-03':[{x:.16,y:.57,label:'Prendas colgadas'},{x:.24,y:.80,label:'Calzado y colección'},{x:.82,y:.77,label:'Mesa y materiales'}],
 'IMG-05':[{x:.40,y:.46,label:'Frentes visibles'},{x:.46,y:.22,label:'Niveles'},{x:.43,y:.68,label:'Visibilidad y alcance'}],
 'IMG-11B':[{x:.38,y:.44,label:'Agrupación por color'},{x:.15,y:.59,label:'Repetición y contraste'},{x:.39,y:.64,label:'Matiz, valor y saturación'}],
 'IMG-07':[{x:.81,y:.27,label:'Luz sobre producto'},{x:.87,y:.76,label:'Sombras y lectura'},{x:.43,y:.38,label:'Luz y comunicación'}],
 'IMG-09':[{x:.27,y:.57,label:'Outfits y maniquíes'},{x:.36,y:.77,label:'Selección y objetivo'},{x:.73,y:.53,label:'Continuidad interior'}],
 'IMG-13':[{x:.24,y:.25,label:'Las referencias'},{x:.55,y:.77,label:'Boceto y materiales'},{x:.77,y:.28,label:'Una aplicación al local'}],
 'IMG-10':[{x:.54,y:.54,label:'Identificar la caja'},{x:.66,y:.45,label:'Acceso a probadores'},{x:.45,y:.77,label:'Observar y mejorar'}]
};

export function imageRect(width,height,ratio=16/9){
 const w=Math.max(0,Math.min(width,height*ratio));
 return {width:w,height:w/ratio,left:(width-w)/2,top:(height-w/ratio)/2};
}
