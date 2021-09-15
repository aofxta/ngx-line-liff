import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { NgxLineLiffService } from './ngx-line-liff.service';
import * as i0 from "@angular/core";
export class NgxLineLiffModule {
    constructor(parentModule) {
        if (parentModule)
            throw new Error('NgxLineLiffModule is already loaded. Import it in the AppModule only');
    }
    static initialize(config) {
        return {
            ngModule: NgxLineLiffModule,
            providers: [
                NgxLineLiffService,
                { provide: 'LineLiffServiceConfig', useValue: config }
            ]
        };
    }
}
NgxLineLiffModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.5", ngImport: i0, type: NgxLineLiffModule, deps: [{ token: NgxLineLiffModule, optional: true, skipSelf: true }], target: i0.ɵɵFactoryTarget.NgModule });
NgxLineLiffModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "12.2.5", ngImport: i0, type: NgxLineLiffModule, imports: [CommonModule] });
NgxLineLiffModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "12.2.5", ngImport: i0, type: NgxLineLiffModule, providers: [
        NgxLineLiffService
    ], imports: [[
            CommonModule,
        ]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.5", ngImport: i0, type: NgxLineLiffModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                    ],
                    providers: [
                        NgxLineLiffService
                    ]
                }]
        }], ctorParameters: function () { return [{ type: NgxLineLiffModule, decorators: [{
                    type: Optional
                }, {
                    type: SkipSelf
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWxpbmUtbGlmZi5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtbGluZS1saWZmL3NyYy9saWIvbmd4LWxpbmUtbGlmZi5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBdUIsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbEYsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0seUJBQXlCLENBQUM7O0FBVTdELE1BQU0sT0FBTyxpQkFBaUI7SUFDMUIsWUFBb0MsWUFBK0I7UUFDL0QsSUFBSSxZQUFZO1lBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxzRUFBc0UsQ0FBQyxDQUFDO0lBQzlHLENBQUM7SUFFTSxNQUFNLENBQUMsVUFBVSxDQUFDLE1BQVc7UUFDaEMsT0FBTztZQUNILFFBQVEsRUFBRSxpQkFBaUI7WUFDM0IsU0FBUyxFQUFFO2dCQUNQLGtCQUFrQjtnQkFDbEIsRUFBRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRTthQUN6RDtTQUNKLENBQUE7SUFDTCxDQUFDOzs4R0FiUSxpQkFBaUIsa0JBQ3dCLGlCQUFpQjsrR0FEMUQsaUJBQWlCLFlBTnRCLFlBQVk7K0dBTVAsaUJBQWlCLGFBSmY7UUFDUCxrQkFBa0I7S0FDckIsWUFMUTtZQUNMLFlBQVk7U0FDZjsyRkFLUSxpQkFBaUI7a0JBUjdCLFFBQVE7bUJBQUM7b0JBQ04sT0FBTyxFQUFFO3dCQUNMLFlBQVk7cUJBQ2Y7b0JBQ0QsU0FBUyxFQUFFO3dCQUNQLGtCQUFrQjtxQkFDckI7aUJBQ0o7MERBRXFELGlCQUFpQjswQkFBdEQsUUFBUTs7MEJBQUksUUFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZSwgT3B0aW9uYWwsIFNraXBTZWxmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOZ3hMaW5lTGlmZlNlcnZpY2UgfSBmcm9tICcuL25neC1saW5lLWxpZmYuc2VydmljZSc7XG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW1xuICAgICAgICBDb21tb25Nb2R1bGUsXG4gICAgXSxcbiAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgTmd4TGluZUxpZmZTZXJ2aWNlXG4gICAgXVxufSlcbmV4cG9ydCBjbGFzcyBOZ3hMaW5lTGlmZk1vZHVsZSB7XG4gICAgY29uc3RydWN0b3IoQE9wdGlvbmFsKCkgQFNraXBTZWxmKCkgcGFyZW50TW9kdWxlOiBOZ3hMaW5lTGlmZk1vZHVsZSkge1xuICAgICAgICBpZiAocGFyZW50TW9kdWxlKSB0aHJvdyBuZXcgRXJyb3IoJ05neExpbmVMaWZmTW9kdWxlIGlzIGFscmVhZHkgbG9hZGVkLiBJbXBvcnQgaXQgaW4gdGhlIEFwcE1vZHVsZSBvbmx5Jyk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBpbml0aWFsaXplKGNvbmZpZzogYW55KTogTW9kdWxlV2l0aFByb3ZpZGVyczxOZ3hMaW5lTGlmZk1vZHVsZT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbmdNb2R1bGU6IE5neExpbmVMaWZmTW9kdWxlLFxuICAgICAgICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgICAgICAgICAgTmd4TGluZUxpZmZTZXJ2aWNlLFxuICAgICAgICAgICAgICAgIHsgcHJvdmlkZTogJ0xpbmVMaWZmU2VydmljZUNvbmZpZycsIHVzZVZhbHVlOiBjb25maWcgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9XG4gICAgfVxufVxuIl19