/* eslint-disable @next/next/no-img-element */
import RatioImage from "@/CommonComponent/RatioImage";
import SVG from "@/CommonComponent/SVG/Svg";
import { Href, ImagePath, StarColorTwo } from "@/Constant/constant";
import Image from "next/image";
import Link from "next/link";

export const FiltersData = [
  {
    name: "Seleccione Especialidad",
    options: ["Cardiologo", "Dermatologo", "Ginecologo", "Pediatra"],
  },
  {
    name: "Seleccione Ciudad",
    options: ["Barranquilla", "Bogota", "Cartagena", "Medellin"],
  },
];

const CategoryTableAction = () => {
  return (
    <div className="product-action">
      <Link href={Href}>
        <SVG iconId="edit-content" />
      </Link>
    </div>
  );
};

export const DirectoryListTableData = [
  {
    image: "dashboard-8/product-categories/wireless-headphone.png",
    name: "Jose Miguel Barrios",
    specialty: "Cardiologo",
    city: "Barranquilla",
    profile: "Basico",
  },
  {
    image: "dashboard-8/product-categories/wireless-headphone.png",
    name: "Maria Martinez",
    specialty: "Pediatra",
    city: "Medellin",
    profile: "Premium",
  },
  {
    image: "dashboard-8/product-categories/wireless-headphone.png",
    name: "Andres Gomez",
    specialty: "Dermatologo",
    city: "Bogota",
    profile: "Basico",
  },
  {
    image: "dashboard-8/product-categories/wireless-headphone.png",
    name: "Lucia Torres",
    specialty: "Ginecologo",
    city: "Medellin",
    profile: "Basico",
  },
  {
    image: "dashboard-8/product-categories/wireless-headphone.png",
    name: "Carlos Ramirez",
    specialty: "Cardiologo",
    city: "Cartagena",
    profile: "Basico",
  },
  {
    image: "dashboard-8/product-categories/wireless-headphone.png",
    name: "Isabel Cruz",
    specialty: "Pediatra",
    city: "Barranquilla",
    profile: "Basico",
  },
  {
    image: "dashboard-8/product-categories/wireless-headphone.png",
    name: "Fernando Sanchez",
    specialty: "Dermatologo",
    city: "Bogota",
    profile: "Basico",
  },
  {
    image: "dashboard-8/product-categories/wireless-headphone.png",
    name: "Valentina Díaz",
    specialty: "Ginecologo",
    city: "Medellin",
    profile: "Premium",
  },
  {
    image: "dashboard-8/product-categories/wireless-headphone.png",
    name: "Eduardo Perez",
    specialty: "Cardiologo",
    city: "Cartagena",
    profile: "Premium",
  },
  {
    image: "dashboard-8/product-categories/wireless-headphone.png",
    name: "Sofia Torres",
    specialty: "Pediatra",
    city: "Barranquilla",
    profile: "Premium",
  },
  {
    image: "dashboard-8/product-categories/wireless-headphone.png",
    name: "Javier Muñoz",
    specialty: "Dermatologo",
    city: "Bogota",
    profile: "Premium",
  },
  {
    image: "dashboard-8/product-categories/wireless-headphone.png",
    name: "Camila Ortiz",
    specialty: "Ginecologo",
    city: "Medellin",
    profile: "Premium",
  },
  {
    image: "dashboard-8/product-categories/wireless-headphone.png",
    name: "Alberto Gómez",
    specialty: "Cardiologo",
    city: "Cartagena",
    profile: "Basico",
  },
  {
    image: "dashboard-8/product-categories/wireless-headphone.png",
    name: "Ana Beltrán",
    specialty: "Pediatra",
    city: "Barranquilla",
    profile: "Premium",
  },
  {
    image: "dashboard-8/product-categories/wireless-headphone.png",
    name: "Ricardo Silva",
    specialty: "Dermatologo",
    city: "Bogota",
    profile: "Premium",
  },
  {
    image: "dashboard-8/product-categories/wireless-headphone.png",
    name: "Laura Vega",
    specialty: "Ginecologo",
    city: "Medellin",
    profile: "Basico",
  },
  {
    image: "dashboard-8/product-categories/wireless-headphone.png",
    name: "Nicolas Herrera",
    specialty: "Cardiologo",
    city: "Cartagena",
    profile: "Premium",
  },
  {
    image: "dashboard-8/product-categories/wireless-headphone.png",
    name: "Mariana Castillo",
    specialty: "Pediatra",
    city: "Barranquilla",
    profile: "Basico",
  },
  {
    image: "dashboard-8/product-categories/wireless-headphone.png",
    name: "David Castro",
    specialty: "Dermatologo",
    city: "Bogota",
    profile: "Basico",
  },
  {
    image: "dashboard-8/product-categories/wireless-headphone.png",
    name: "Tatiana López",
    specialty: "Ginecologo",
    city: "Medellin",
    profile: "Premium",
  },
  {
    image: "dashboard-8/product-categories/wireless-headphone.png",
    name: "Gabriel Torres",
    specialty: "Cardiologo",
    city: "Cartagena",
    profile: "Basico",
  },
  {
    image: "dashboard-8/product-categories/wireless-headphone.png",
    name: "Elena Martinez",
    specialty: "Pediatra",
    city: "Barranquilla",
    profile: "Premium",
  },
  {
    image: "dashboard-8/product-categories/wireless-headphone.png",
    name: "Felipe Arias",
    specialty: "Dermatologo",
    city: "Bogota",
    profile: "Basico",
  },
  {
    image: "dashboard-8/product-categories/wireless-headphone.png",
    name: "Sandra Rios",
    specialty: "Ginecologo",
    city: "Medellin",
    profile: "Premium",
  },
  {
    image: "dashboard-8/product-categories/wireless-headphone.png",
    name: "Cristian Salazar",
    specialty: "Cardiologo",
    city: "Cartagena",
    profile: "Premium",
  },
  {
    image: "dashboard-8/product-categories/wireless-headphone.png",
    name: "Natalia Gómez",
    specialty: "Pediatra",
    city: "Barranquilla",
    profile: "Basico",
  },
];

const DirectoryListTableAction = () => {
  return (
    <div className="product-action">
      <Link href="/admin/empleados/detalle">
        <SVG iconId="edit-content" />
      </Link>
    </div>
  );
};

export const DirectoryListTableDataColumn = [
  {
    name: "Nombre",
    selector: (row) => `${row.name}`,
    sortable: true,
  },
  {
    name: "Especialidad",
    selector: (row) => `${row.specialty}`,
    sortable: true,
  },
  {
    name: "Ciudad",
    selector: (row) => `${row.city}`,
    sortable: true,
  },
  {
    name: "Perfil",
    selector: (row) => `${row.profile}`,
    sortable: true,
  },
  {
    name: "Opción",
    cell: () => <DirectoryListTableAction />,
  },
];
