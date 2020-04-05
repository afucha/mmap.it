import * as Mixpanel from 'mixpanel';
import * as ip from 'ip';

class MetricsManager { 

    // properties
    _client: any | null;
    _userId: string | null;

    constructor() {
        this._client = Mixpanel.init(process.env.MIXPANEL_MMAP_KEY, {
            protocol: 'https'
        });

        this._userId = "";
    }

    setUserId(userId: string) {
        this._userId = userId;
    }

    createUser() {
        this._client.people.set(this._userId, {
            $created: (new Date()).toISOString(),
            $ip: ip.address(),
            plan: 'basic',
            searches: 0,
            saves: 0,
            deletes: 0,
            updates: 0,
            logins: 0,
        });
    }

    userLogin() {
        this._client.people.increment(this._userId, 'logins')
    }

    userSearch() {
        this._client.people.increment(this._userId, 'searches')
    }

    userSave() {
        this._client.people.increment(this._userId, 'saves')
    }

    userUpdates() {
        this._client.people.increment(this._userId, 'updates')
    }

    userDeletes() {
        this._client.people.increment(this._userId, 'deletes')
    }

}

export { MetricsManager };
