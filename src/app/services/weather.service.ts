import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { WeatherForecast } from '../interfaces/wearher-forecast';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private readonly apiKey = environment.openWeatherApiToken;
  private readonly geocodingUrl = 'https://api.openweathermap.org/geo/1.0/direct';
  private readonly forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

  constructor(private http: HttpClient) {}

  getWeatherInformation(city: string, date: Date, time: string): Observable<WeatherForecast | null> {
    if (!city || !date || !time) {
      return of(null);
    }

    const geoUrl = `${this.geocodingUrl}?q=${encodeURIComponent(city)}&limit=1&appid=${this.apiKey}`;

    return this.http.get<any[]>(geoUrl).pipe(
      switchMap((geoData) => {
        if (!geoData.length) { return of(null); }

        const { lat, lon } = geoData[0];
        const forecastUrl = `${this.forecastUrl}?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`;

        return this.http.get<any>(forecastUrl).pipe(
          map((response) => {
            const targetTime = new Date(`${date.toISOString().split('T')[0]}T${time}`);
            const closest = response?.list?.reduce((a: any, b: any) => {
              const aDiff = Math.abs(new Date(a.dt_txt).getTime() - targetTime.getTime());
              const bDiff = Math.abs(new Date(b.dt_txt).getTime() - targetTime.getTime());
              return aDiff < bDiff ? a : b;
            });

            return {
              temperature: closest?.main?.temp,
              condition: closest?.weather?.[0]?.description,
              iconUrl: closest?.weather?.[0]?.icon
                ? `https://openweathermap.org/img/wn/${closest.weather[0].icon}@2x.png`
                : null
            } as WeatherForecast;
          }),
          catchError(err => {
            console.warn('Forecast API failed', err);
            return of(null);
          })
        );
      }),
      catchError(err => {
        console.warn('Geocoding API failed', err);
        return of(null);
      })
    );
  }
}
