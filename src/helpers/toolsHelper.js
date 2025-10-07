import Swal from "sweetalert2";

export function showErrorDialog(message) {
  Swal.fire({
    title: "Terjadi Kesalahan",
    text: message,
    icon: "error",
    confirmButtonText: "Tutup",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.close();
    }
  });
}

export function showWarningDialog(message) {
  Swal.fire({
    title: "Peringatan",
    text: message,
    icon: "warning",
    confirmButtonText: "Tutup",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.close();
    }
  });
}

export function showSuccessDialog(message) {
  Swal.fire({
    title: "Tindakan Berhasil",
    text: message,
    icon: "success",
    confirmButtonText: "Tutup",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.close();
    }
  });
}

export function showConfirmDialog(message) {
  return Swal.fire({
    title: "Konfirmasi",
    text: message,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Ya",
    cancelButtonText: "Tidak",
  });
}

export function formatDate(date) {
  return new Date(date).toLocaleString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}