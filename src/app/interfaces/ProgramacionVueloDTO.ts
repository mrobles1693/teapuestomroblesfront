export interface ProgramacionVueloDTO
{
    nIdProgramacionVuelo : number,
    nIdRuta : number,
    nIdAeronave : number,
    dFechaProgramada : Date,
}

export interface searchProgramacionVueloDTO
{
    nIdCiudadOrigen : number,
    nIdCiudadDestino : number,
    nCantidadPax : number,
    nIdProgramacionVueloIda? : number
}

export interface ProgramacionVueloCantDTO
{ 
    nCapacidad : number,
    nPasajeros : number,
}