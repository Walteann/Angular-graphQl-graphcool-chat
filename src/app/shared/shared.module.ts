import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '../../../node_modules/@angular/forms';
import {
    MatCardModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatListModule,
    MatIconModule,
    MatLineModule,
    MatSidenavModule,
    MatTabsModule
 } from '@angular/material';
import { NoRecordComponent } from './components/no-record/no-record.component';
@NgModule({
    declarations: [NoRecordComponent],
    imports: [MatIconModule],
    exports: [
        CommonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatListModule,
        MatIconModule,
        MatLineModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
        MatSidenavModule,
        MatToolbarModule,
        MatTabsModule,
        MatSlideToggleModule,
        NoRecordComponent,
        ReactiveFormsModule
    ],
})
export class SharedModule { }
