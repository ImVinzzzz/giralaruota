# Gira la Ruota — Versione 4.0

Un'applicazione web interattiva ispirata al celebre gioco televisivo **"La Ruota della Fortuna"**. Il progetto è sviluppato interamente con tecnologie web standard (HTML5, CSS3, JavaScript Vanilla) e offre un'interfaccia moderna e dinamica per sfidare gli amici indovinando frasi misteriose.

---

## 🎮 Descrizione del Gioco

**Gira la Ruota** è un gioco a turni in cui da 2 a 6 giocatori si sfidano per indovinare una frase nascosta sul tabellone, accumulando punti e scalando la classifica della manche.

### Regole e Meccanica di Gioco

1. **Configurazione Iniziale**:
   * All'avvio, viene selezionata la partita (un set di frasi caricato da un file JSON) e inserito il numero di giocatori (da 2 a 6) con i relativi nomi.
   * La partita si sviluppa su più manche (solitamente 5), ognuna con un argomento specifico.

2. **Svolgimento del Turno**:
   A ogni turno, il giocatore attivo può scegliere tra tre azioni:
   * **Gira la Ruota**: Facendo girare la ruota sul canvas, si ottiene un valore in punti (o esiti speciali come *Passa*, *Perde*). Se esce un punteggio, il giocatore deve chiamare una **consonante**:
     * Se la consonante è presente nella frase misteriosa, le caselle corrispondenti si rivelano, il giocatore guadagna i punti (moltiplicati per il numero di volte in cui compare la lettera) e mantiene il turno.
     * Se la consonante non è presente, il turno passa al giocatore successivo.
   * **Acquista Vocale**: Se il giocatore possiede almeno **500 punti** accumulati nella manche corrente, può spenderli per acquistare una vocale (A, E, I, O, U) per rivelarne la presenza sul tabellone.
   * **Risoluzione (Soluzione)**: Se un giocatore pensa di conoscere la frase intera, può tentare di dare la soluzione. Rivelando correttamente la frase, si aggiudica la manche corrente e i punti accumulati vengono consolidati.

3. **Vittoria**:
   * Al termine di tutte le manche, il giocatore con il punteggio totale più alto viene proclamato vincitore della partita.

---

## 🛠️ Funzionalità Principali

* **Interfaccia Grafica Premium**: Design moderno con font dedicati (*Bebas Neue*, *Oswald*), layout responsive a 3 colonne durante la partita e transizioni animate fluide.
* **Ruota Interattiva**: Gestita tramite HTML5 Canvas, con fisica di rallentamento realistica ed effetti sonori integrati per i vari esiti.
* **Editor di Frasi Integrato**: Un comodo editor visuale (`gira-editor.html` e schermate collegate) che permette di creare e modificare le frasi delle partite, salvandole direttamente in formato JSON.
* **Gestione Dinamica dei Giocatori**: Supporto flessibile per un numero di partecipanti variabile da 2 a 6 con tabellone dei punteggi aggiornato in tempo reale.
* **Audio ed Effetti Sonori**: Feedback sonoro per risposte corrette (`ok.mp3`), risposte errate (`ko.mp3`), cambio manche, perdita del turno e vittoria finale.

---

## 📁 Struttura del Progetto

```text
├── datas/               # File JSON contenenti i set di frasi/partite
│   ├── index.json       # Indice dei file delle partite disponibili
│   ├── Cinque.json      # Set di frasi per partita
│   └── ...
├── gira-editor.html     # Editor autonomo per la creazione dei file di frasi JSON
├── index.html           # File principale dell'applicazione (schermate e tabellone)
├── script.js            # Logica di gioco in JavaScript Vanilla
├── style.css            # Stili grafici, animazioni e layout responsive
├── icona.png            # Icona dell'applicazione
├── logo_*.png           # Asset grafici e loghi in varie dimensioni
└── *.mp3                # Effetti sonori di gioco (ok, ko, passa, perde, ecc.)
```

---

## 🚀 Come Iniziare

1. Scarica o clona la cartella del progetto.
2. Apri il file [index.html](file:///s:/Progetti%20GitHub/Gira%20la%20Ruota/ruota%204.0/index.html) in un qualsiasi browser web moderno.
3. *Nota*: Poiché il gioco effettua richieste per caricare i file JSON delle frasi dalla cartella `datas/`, per il corretto funzionamento in locale si consiglia di avviare il progetto tramite un server web locale (come l'estensione **Live Server** di VS Code, oppure tramite comandi rapidi come `python -m http.server 8000` dalla cartella del progetto).
