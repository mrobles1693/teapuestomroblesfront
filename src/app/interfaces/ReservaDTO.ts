export interface InsReservaDTO
{
    nIdProgramacionVuelo : number,
    nCantidadPax : number
}

export interface InsPasajeroDTO
{
    nIdReserva : number,
    bPrincipal : boolean,
    sDNI : string,
    sPasaporte : string,
    sApellidoP : string,
    sApellidoM : string,
    sPriNombre : string,
    sSegNombre : string,
    sCelular : string,
    sCorreo : string,
    dFechaNacimiento : Date,
}