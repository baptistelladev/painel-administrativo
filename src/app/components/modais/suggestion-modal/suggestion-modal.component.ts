import { SuggestionsService } from 'src/app/core/services/firebase/suggestions.service';
import { MOCK_HASHTAGS } from './../../../shared/mocks/MockHashtags';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { find, Observable, Subscription } from 'rxjs';
import { CepService } from 'src/app/core/services/cep.service';
import { MOCK_PROFILES } from 'src/app/shared/mocks/MockProfiles';
import { MOCK_SUGGESTION_FILTERS } from 'src/app/shared/mocks/MockSuggestionFilters';
import { IAdress } from 'src/app/shared/models/IAddress';
import { ISuggestion } from 'src/app/shared/models/ISuggestion';
import { CollectionsEnum } from 'src/app/shared/enums/Collection';
import { IHashtag } from 'src/app/shared/models/IHashtag';
import { IProfileType } from 'src/app/shared/models/IProfileType';
import { Store } from '@ngrx/store';
import * as AppStore from './../../../shared/store/app.state';

@Component({
  selector: 'app-suggestion-modal',
  templateUrl: './suggestion-modal.component.html',
  styleUrls: ['./suggestion-modal.component.scss'],
})
export class SuggestionModalComponent  implements OnInit, AfterViewInit {

  public suggestion: ISuggestion = {
    specific_place: null,
    id: '',
    hashtag: null,
    name: {
      text: null,
      title: null
    },
    value: '',
    created_at: '',
    updated_at: '',
    route: '',
    address: {
      type: {
        pt: '',
        en: '',
        es: ''
      },
      street: '',
      neighborhood: 'string'
    },
    location: {
      lat: 0,
      lng: 0
    },
    icon: '',
    filter: [],
    indication: []
  }

  public isRegistering: boolean = false;

  public suggestionFormGroup: FormGroup;

  public MOCK_HASHTAGS = MOCK_HASHTAGS;
  public MOCK_SUGGESTION_FILTERS = MOCK_SUGGESTION_FILTERS;
  public MOCK_PROFILES = MOCK_PROFILES;

  public currentSuggestion: ISuggestion;
  public currentSuggestion$: Observable<ISuggestion>;
  public currentSuggestionSubscription: Subscription;

  public currentSuggestionHasntChanges: boolean = true;
  public currentSuggestionFormListener$: Observable<boolean>;
  public currentSuggestionFormListenerSubscription: Subscription;

  constructor(
    private modalCtrl : ModalController,
    private formBuilder : FormBuilder,
    private cepService : CepService,
    private suggestionsService : SuggestionsService,
    private store : Store
  ) { }

  ngOnInit() {
    this.initSuggestionForm();
    this.getCurrentSuggestionFromNGRX();
  }

  public getCurrentSuggestionFromNGRX(): void {
    this.currentSuggestion$ = this.store.select(AppStore.selectCurrentSuggestion);

    this.currentSuggestionSubscription = this.currentSuggestion$
    .subscribe({
      next: async (suggestion: ISuggestion) => {
        this.currentSuggestion = suggestion;

        if (this.currentSuggestion.id) {
          await this.fillFormAndVariablesWhenComesFromDetail(this.currentSuggestion);
        }

        this.checkSpecificAdress();
        this.initSuggestionFormListener();
      }
    })
  }

  ngAfterViewInit(): void {

  }

  public async fillFormAndVariablesWhenComesFromDetail(suggestion: ISuggestion) {

    this.suggestionFormGroup.get('specific_place_pt')?.patchValue(suggestion.specific_place.pt);
    this.suggestionFormGroup.get('specific_place_en')?.patchValue(suggestion.specific_place.en);
    this.suggestionFormGroup.get('specific_place_es')?.patchValue(suggestion.specific_place.es);

    this.suggestionFormGroup.get('zip_code')?.patchValue('');
    this.suggestionFormGroup.get('type')?.patchValue(suggestion.address.type.pt);
    this.suggestionFormGroup.get('street')?.patchValue(suggestion.address.street);
    this.suggestionFormGroup.get('neighborhood')?.patchValue(suggestion.address.neighborhood);

    this.suggestionFormGroup.get('specificAddress')?.patchValue(false);

    this.suggestionFormGroup.get('text_pt')?.patchValue(suggestion.name.text.pt);
    this.suggestionFormGroup.get('text_en')?.patchValue(suggestion.name.text.en);
    this.suggestionFormGroup.get('text_es')?.patchValue(suggestion.name.text.es);

    this.suggestionFormGroup.get('title_pt')?.patchValue(suggestion.name.title.pt);
    this.suggestionFormGroup.get('title_en')?.patchValue(suggestion.name.title.en);
    this.suggestionFormGroup.get('title_es')?.patchValue(suggestion.name.title.es);

    this.suggestionFormGroup.get('lat')?.patchValue(suggestion.location?.lat);
    this.suggestionFormGroup.get('lng')?.patchValue(suggestion.location?.lng);

    this.suggestionFormGroup.get('value')?.patchValue(suggestion.value);

    this.suggestionFormGroup.get('route')?.patchValue(suggestion.route);

    this.suggestionFormGroup.get('icon')?.patchValue(suggestion.icon);

    this.suggestionFormGroup.get('hashtag')?.patchValue(suggestion.hashtag.value);

    this.suggestionFormGroup.get('filter')?.patchValue(suggestion.filter);

    let indication: string[] = suggestion.indication.map((profile: IProfileType) => {
      return profile.value
    })

    this.suggestionFormGroup.get('indication')?.patchValue(indication);

    if (suggestion.address.street) {
      this.suggestionFormGroup.get('specificAddress')?.patchValue(true);
    } else {
      this.suggestionFormGroup.get('specificAddress')?.patchValue(false);
    }
  }

  public closeModal(): void {
    this.modalCtrl.dismiss();
    this.suggestionFormGroup.reset();
  }

  public initSuggestionForm(): void {
    this.suggestionFormGroup = this.formBuilder.group({
      specificAddress: true,
      zip_code: ['', [ Validators.minLength(8) ]],
      type: '',
      street: '',
      neighborhood: '',
      specific_place_pt: '',
      specific_place_en: '',
      specific_place_es: '',
      lat: '',
      lng: '',
      text_pt: '',
      text_en: '',
      text_es: '',
      title_pt: '',
      title_en: '',
      title_es: '',
      hashtag: '',
      icon: '',
      value: ['', [ Validators.required ]],
      route: '',
      filter: ['', [ Validators.required ]],
      indication: ['', [ Validators.required ]]
    })

  }

  public initSuggestionFormListener(): void {
    this.currentSuggestionFormListener$ = this.suggestionFormGroup.valueChanges;
    this.currentSuggestionFormListenerSubscription = this.currentSuggestionFormListener$
    .subscribe({
      next: (res: any) => {
        this.currentSuggestionHasntChanges = false;
      }
    })
  }

  public filtersChanged(e: any): void {
    console.log(e);
  }

  public indicationChanged(e: any): void {
    console.log(e);
  }

  public transformStringForValue(): void {
    const control = this.suggestionFormGroup.get('value');

    if (control) {
      let value = control.value || '';

      // Converte para maiúsculas, remove espaços extras e substitui espaços no meio por "_"
      value = value
        .toUpperCase()
        .replace(/\s+/g, '_');

      // Atualiza o valor do controle no formulário
      control.setValue(value, { emitEvent: false });
    }
  }

  public transformStringForRoute(): void {
    const control = this.suggestionFormGroup.get('route');

    if (control) {
      let value = control.value || '';

      // Converte para maiúsculas, remove espaços extras e substitui espaços no meio por "_"
      value = value
        .toLowerCase()
        .replace(/\s+/g, '-');

      // Atualiza o valor do controle no formulário
      control.setValue(value, { emitEvent: false });
    }
  }

  public hashtagChanged(e: any): void {
    console.log(e);

  }

  public async getCep() {
    let cep = this.suggestionFormGroup.get('zip_code')?.value;

    if (cep.length > 8) {
      return;
    }

    if (cep.length === 8) {
     await this.cepService.getCep(cep).then((adress: IAdress) => {

      let longStreetName: string = adress.logradouro;
      let streetSplited: string[] = longStreetName.split(' ');
      let type: string = streetSplited[0].toLowerCase();
      let shortStreetName: string = streetSplited.slice(1).join(' ');

      switch (type) {
        case 'rua':
          this.suggestion.address.type.pt = 'Rua';
          this.suggestion.address.type.en = 'Street';
          this.suggestion.address.type.es = 'Calle';
          break;

        case 'avenida':
          this.suggestion.address.type.pt = 'Avenida';
          this.suggestion.address.type.en = 'Avenue';
          this.suggestion.address.type.es = 'Avenida';
          break;
      }

      this.suggestionFormGroup.patchValue({ street: shortStreetName });
      this.suggestionFormGroup.patchValue({ neighborhood: adress.bairro });
      this.suggestionFormGroup.patchValue({ type: type.charAt(0).toUpperCase() + type.slice(1).toLowerCase() });
     })
    }

  }

  public async register(type: 'create' | 'update') {
    this.isRegistering = true;

    if (this.currentSuggestion?.id) {
      this.suggestion.id = this.currentSuggestion.id;
    }

    let blankValue = {
      value: '',
      text: {
        pt: '',
        en: '',
        es: ''
      }
    }

    switch (this.suggestionFormGroup.get('type')?.value.toLowerCase()) {
      case 'rua':
        this.suggestion.address.type = {
          pt: 'Rua',
          en: 'Street',
          es: 'Calle'
        }
        break;

      case 'avenida':
        this.suggestion.address.type = {
          pt: 'Avenida',
          en: 'Avenue',
          es: 'Avenida'
        }
        break;
    }

    this.suggestion.address.street = this.suggestionFormGroup.get('street')?.value;
    this.suggestion.address.neighborhood = this.suggestionFormGroup.get('neighborhood')?.value;

    this.suggestion.location = {
      lat: Number(this.suggestionFormGroup.get('lat')?.value),
      lng: Number(this.suggestionFormGroup.get('lng')?.value)
    }

    this.suggestion.name = {
      text: {
        pt: this.suggestionFormGroup.get('text_pt')?.value,
        en: this.suggestionFormGroup.get('text_en')?.value,
        es: this.suggestionFormGroup.get('text_es')?.value
      },
      title: {
        pt: this.suggestionFormGroup.get('title_pt')?.value,
        en: this.suggestionFormGroup.get('title_en')?.value,
        es: this.suggestionFormGroup.get('title_es')?.value
      }
    }

    this.suggestion.value = this.suggestionFormGroup.get('value')?.value;
    this.suggestion.route = this.suggestionFormGroup.get('route')?.value;
    this.suggestion.icon = this.suggestionFormGroup.get('icon')?.value;

    let foundHashtag = this.MOCK_HASHTAGS.find((hashtag: IHashtag) => {
      return hashtag.value === this.suggestionFormGroup.get('hashtag')?.value
    })

    if (foundHashtag) {
      this.suggestion.hashtag = foundHashtag;
    } else {
      this.suggestion.hashtag = blankValue;
    }

    this.suggestion.filter = this.suggestionFormGroup.get('filter')?.value;

    this.suggestion.updated_at = moment().toISOString();

    this.suggestion.specific_place = {
      pt: this.suggestionFormGroup.get('specific_place_pt')?.value,
      en: this.suggestionFormGroup.get('specific_place_en')?.value,
      es: this.suggestionFormGroup.get('specific_place_es')?.value
    }

    let foundProfiles = this.MOCK_PROFILES.filter((profileType: IProfileType) => {
      let profiles: any[] = this.suggestionFormGroup.get('indication')?.value;
      return profiles.includes(profileType.value);
    })

    this.suggestion.indication = foundProfiles;

    if (type === 'create') {
      this.suggestion.created_at = moment().toISOString();

      await this.suggestionsService
      .addSuggestionDoc(CollectionsEnum.SUGGESTIONS_BAIXADA_SANTISTA, this.suggestion)
      .then(async () => {
        await this.modalCtrl.dismiss({ suggestion: this.suggestion }, '', 'register-suggestion');

        this.isRegistering = false;
        this.suggestionFormGroup.reset();
      }).catch(() => {
        this.isRegistering = false;
      })

    } else {
      await this.suggestionsService
      .setSuggestionDoc(CollectionsEnum.SUGGESTIONS_BAIXADA_SANTISTA, this.currentSuggestion.id, this.suggestion)
      .then(async () => {
        await this.modalCtrl.dismiss({ suggestion: this.suggestion }, '', 'register-suggestion');

        this.isRegistering = false;
        this.suggestionFormGroup.reset();

        console.log('atualizou', this.suggestion);


      }).catch(() => {
        this.isRegistering = false;
      })
    }
  }

  public checkSpecificAdress(): void {
    if (this.suggestionFormGroup.get('specificAddress')?.value) {
      // Define os validadores para os campos necessários
      //this.suggestionFormGroup.get('zip_code')?.setValidators([Validators.required]);
      this.suggestionFormGroup.get('type')?.setValidators([Validators.required]);
      this.suggestionFormGroup.get('street')?.setValidators([Validators.required]);
      this.suggestionFormGroup.get('neighborhood')?.setValidators([Validators.required]);

      // Remove validadores e redefine valores dos campos de locais específicos
      this.suggestionFormGroup.get('specific_place_pt')?.clearValidators();
      //this.suggestionFormGroup.get('specific_place_pt')?.setValue('');
      this.suggestionFormGroup.get('specific_place_en')?.clearValidators();
      //this.suggestionFormGroup.get('specific_place_en')?.setValue('');
      this.suggestionFormGroup.get('specific_place_es')?.clearValidators();
      //this.suggestionFormGroup.get('specific_place_es')?.setValue('');

      // Atualiza o estado dos controles após modificar validadores
      this.suggestionFormGroup.get('zip_code')?.updateValueAndValidity();
      this.suggestionFormGroup.get('type')?.updateValueAndValidity();
      this.suggestionFormGroup.get('street')?.updateValueAndValidity();
      this.suggestionFormGroup.get('neighborhood')?.updateValueAndValidity();
      this.suggestionFormGroup.get('specific_place_pt')?.updateValueAndValidity();
      this.suggestionFormGroup.get('specific_place_en')?.updateValueAndValidity();
      this.suggestionFormGroup.get('specific_place_es')?.updateValueAndValidity();
    } else {
      // Remove validadores de todos os campos relacionados
      this.suggestionFormGroup.get('zip_code')?.clearValidators();
      this.suggestionFormGroup.get('type')?.clearValidators();
      this.suggestionFormGroup.get('street')?.clearValidators();
      this.suggestionFormGroup.get('neighborhood')?.clearValidators();

      // Redefine os valores dos campos
      //this.suggestionFormGroup.get('zip_code')?.setValue('');
      //this.suggestionFormGroup.get('type')?.setValue('');
      //this.suggestionFormGroup.get('street')?.setValue('');
      //this.suggestionFormGroup.get('neighborhood')?.setValue('');

      // Adiciona validação obrigatória aos campos de locais específicos
      this.suggestionFormGroup.get('specific_place_pt')?.setValidators([Validators.required]);
      this.suggestionFormGroup.get('specific_place_en')?.setValidators([Validators.required]);
      this.suggestionFormGroup.get('specific_place_es')?.setValidators([Validators.required]);

      // Atualiza o objeto suggestion
      //this.suggestion.address.type.pt = '';
      //this.suggestion.address.type.en = '';
      //this.suggestion.address.type.es = '';

      // Atualiza o estado dos controles após modificar validadores
      this.suggestionFormGroup.get('zip_code')?.updateValueAndValidity();
      this.suggestionFormGroup.get('type')?.updateValueAndValidity();
      this.suggestionFormGroup.get('street')?.updateValueAndValidity();
      this.suggestionFormGroup.get('neighborhood')?.updateValueAndValidity();
      this.suggestionFormGroup.get('specific_place_pt')?.updateValueAndValidity();
      this.suggestionFormGroup.get('specific_place_en')?.updateValueAndValidity();
      this.suggestionFormGroup.get('specific_place_es')?.updateValueAndValidity();
    }
  }
}
