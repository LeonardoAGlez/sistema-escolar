import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { FacadeService } from 'src/app/services/facade.service';

@Component({
  selector: 'app-graficas-screen',
  templateUrl: './graficas-screen.component.html',
  styleUrls: ['./graficas-screen.component.scss'],
})
export class GraficasScreenComponent implements OnInit {
  //Variables
  public total_user: any = {};
  public rol: string = '';
  public token: string = '';

  private readonly roleLabels = ['Administradores', 'Maestros', 'Alumnos'];
  private readonly roleColors = ['#1f395c', '#2b5082', '#447fce'];

  //Barras
  barChartData = {
    labels: this.roleLabels,
    datasets: [
      {
        data: [] as number[],
        label: 'Usuarios por rol',
        backgroundColor: this.roleColors,
      },
    ],
  };
  barChartOption: any = {
    responsive: true,
    scales: {
      y: {
        ticks: {
          stepSize: 1,
          precision: 0,
        },
        beginAtZero: true,
      },
    },
  };
  barChartPlugins = [DatalabelsPlugin];

  //Barras horizontales (histograma)
  barChartDataHorizontal = {
    labels: this.roleLabels,
    datasets: [
      {
        data: [] as number[],
        label: 'Usuarios por rol (histograma)',
        backgroundColor: this.roleColors,
      },
    ],
  };
  barChartOptionHorizontal: any = {
    responsive: true,
    indexAxis: 'y',
    scales: {
      x: {
        ticks: {
          stepSize: 1,
          precision: 0,
        },
        beginAtZero: true,
      },
    },
  };
  barChartPluginsHorizontal = [DatalabelsPlugin];

  //Circular
  pieChartData = {
    labels: this.roleLabels,
    datasets: [
      {
        data: [0, 0, 0],
        label: 'Registro de usuarios',
        backgroundColor: this.roleColors,
      },
    ],
  };
  pieChartOption = {
    responsive: true,
  };
  pieChartPlugins = [DatalabelsPlugin];

  //Dona
  doughnutChartData = {
    labels: this.roleLabels,
    datasets: [
      {
        data: [0, 0, 0],
        label: 'Registro de usuarios',
        backgroundColor: this.roleColors,
      },
    ],
  };
  doughnutChartOption = {
    responsive: true,
  };
  doughnutChartPlugins = [DatalabelsPlugin];

  constructor(
    private administradoresServices: AdministradoresService,
    private facadeService: FacadeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.rol = this.facadeService.getUserGroup();
    this.token = this.facadeService.getSessionToken();

    // Validar que haya inicio de sesión
    if (this.token == '') {
      this.router.navigate(['/']);
      return;
    }

    // Solo administradores pueden acceder a esta vista
    if (this.rol !== 'administrador') {
      alert('No tienes permisos para acceder a las gráficas');
      this.router.navigate(['/home']);
      return;
    }

    this.obtenerTotalUsers();
  }

  public obtenerTotalUsers() {
    this.administradoresServices.getTotalUsuarios().subscribe(
      (response) => {
        this.total_user = response;
        console.log('Total usuarios: ', this.total_user);
        this.actualizarGraficasUsuarios();
      },
      (error) => {
        console.log('Error al obtener total de usuarios ', error);
        alert('No se pudo obtener el total de cada rol de usuarios');
      }
    );
  }

  private actualizarGraficasUsuarios(): void {
    const admins = this.total_user.admins || 0;
    const maestros = this.total_user.maestros || 0;
    const alumnos = this.total_user.alumnos || 0;
    const data = [admins, maestros, alumnos];

    this.barChartData = {
      ...this.barChartData,
      datasets: [
        {
          ...this.barChartData.datasets[0],
          data,
        },
      ],
    };

    this.barChartDataHorizontal = {
      ...this.barChartDataHorizontal,
      datasets: [
        {
          ...this.barChartDataHorizontal.datasets[0],
          data,
        },
      ],
    };

    this.pieChartData = {
      ...this.pieChartData,
      datasets: [
        {
          ...this.pieChartData.datasets[0],
          data,
        },
      ],
    };

    this.doughnutChartData = {
      ...this.doughnutChartData,
      datasets: [
        {
          ...this.doughnutChartData.datasets[0],
          data,
        },
      ],
    };
  }
}
