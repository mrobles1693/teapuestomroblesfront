import { FormControl } from "@angular/forms";

export interface InsReservaDTO
{
    nCantidadPax : number,
    nIdProgramacionVueloIda : number,
    nIdProgramacionVueloVuelta? : number,
}

export interface InsPasajeroDTO
{
    nIdReserva : number,
    bPrincipal : boolean,
    sDNI? : string,
    sPasaporte? : string,
    sApellidoP : string,
    sApellidoM : string,
    sPriNombre : string,
    sSegNombre? : string,
    sCelular : string,
    sCorreo : string,
    dFechaNacimiento : Date,
}

export interface FormPasajeroDTO
{
    nIdReservaPasajero : number | null,
    fcDNI : FormControl<any>,
    fcPasaporte : FormControl<any>,
    fcApellidoP : FormControl<any>,
    fcApellidoM : FormControl<any>,
    fcPriNombre : FormControl<any>,
    fcSegNombre : FormControl<any>,
    fcCelular : FormControl<any>,
    fcCorreo : FormControl<any>,
    fcFechaNacimiento : FormControl<any>,
}