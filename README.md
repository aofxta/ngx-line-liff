# Angular LINE LIFF

> Use [Discussions](https://github.com/aofxta) for questions.

Authentication module for Angular. Supports authentication with LINE-LIFF. Can be extended to other providers also.

### Comatibility Matrix

| Library Version | Angular Version | @line/liff |
| - | - | - |
| 0.0.1 | 12 | 2.13.0 |

## Getting started

### Install via npm

```sh
npm i ngx-line-liff
npm i @line/liff
```

### Import the module

In your `AppModule`, import the `SocialLoginModule`

```javascript
...
import {
	NgxLineLiffModule,
	LineLiffLoginProvider,
	LineLiffServiceConfig
} from 'ngx-line-liff';

const ngxLiffConfig = <LineLiffServiceConfig>{
	autoLogin: false,
	providers: [
		{
			id: LineLiffLoginProvider.PROVIDER_ID,
			provider: new LineLiffLoginProvider('channel_id', { liffId: 'liff_id' })
		}
	],
	onError: (err: any) => console.log(err)
}

@NgModule({
  declarations: [ ... ],
  imports: [
		...
		SocialLoginModule
  ],
  providers: [
		{
			provide: 'LineLiffServiceConfig',
			useValue: ngxLiffConfig as LineLiffServiceConfig
		}
  ],
  bootstrap: [...]
})
export class AppModule { }
```

### Sign in and out users

```javascript
...
import { NgxLineLiffService } from 'ngx-line-liff';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {

	constructor(private auth: NgxLineLiffService) { }

	statusLogined(): void {
		this.ngxLineLiff.getLoginStatus();
	}
	authLogin(): void {
		//-- this.ngxLineLiff.signIn();
		this.ngxLineLiff.signIn({ redirectUri: window.location.href });
	}
	authLogout(): void {
		this.ngxLineLiff.signOut();
	}
}
```

### Subscribe to the authentication state

You receive a `LineProfile` object when the user logs in and a `null` when the user logs out. `LineProfile` object contains basic user information such as name, photo URL, etc.

```javascript
...
import { NgxLineLiffService, LineProfile } from 'ngx-line-liff';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {

	user: LineProfile;
	loggedIn: boolean;

	constructor(private auth: NgxLineLiffService) { }

	ngOnInit() {
		this.auth.authState.subscribe(user => {
			this.user = user;
			this.loggedIn = (user != null);
		});
	}
}
```

### Display the user information

```html
<img src="{{ user.pictureUrl }}">
<div>
	<h4>{{ user.displayName }}</h4>
	<p>{{ user.statusMessage }}</p>
</div>
```
