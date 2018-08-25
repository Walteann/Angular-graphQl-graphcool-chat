import { NgModule, Optional, SkipSelf } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ApolloConfigModule } from './../apollo-config.module';

@NgModule({
    exports: [
        BrowserAnimationsModule,
        ApolloConfigModule
    ],

})
export class CoreModule {

    constructor(
        @Optional() @SkipSelf() paremtModule: CoreModule
    ) {
        if (paremtModule) {
            throw new Error('CoreModule já foi carregado, importe ele no appModule também');
        }
    }


}
