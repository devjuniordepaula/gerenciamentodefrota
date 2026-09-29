import { SectorsClient } from "./SetoresCliente";

export default async function SectorsPage() {
  const sectors = [
    { id: '1', name: 'Logística SP', code: 'LOG-01', manager: 'Carlos Silva', budget: 50000 },
    { id: '2', name: 'Operações RJ', code: 'OPR-02', manager: 'Mariana Costa', budget: 35000 },
  ];
  return <SectorsClient initialSectors={sectors} />;
}