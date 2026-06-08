import { Injectable, signal, computed } from '@angular/core';

export type AlertType = 'success' | 'error' | 'warning';

interface AlertConfig {
  message: string;
  type: AlertType;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private configSignal = signal<AlertConfig | null>(null);
  private timeoutId: any;
  readonly currentAlert = computed(() => this.configSignal());

  /**
   * Ativa o alerta global na tela.
   * @param message Texto que será exibido
   * @param type Tipo do alerta ('success' | 'error' | 'warning')
   * @param durationMs Tempo em milissegundos antes de desaparecer (padrão: 4 segundos)
   */
  showAlert(message: string, type: AlertType = 'success', durationMs: number = 4000): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.configSignal.set({ message, type });

    this.timeoutId = setTimeout(() => {
      this.configSignal.set(null);
    }, durationMs);
  }
}
