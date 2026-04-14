/**
 * BÀI TOÁN: TRIỆU PHÚ VÀ CƯỚP QUA SÔNG (STATE SPACE SEARCH)
 * 
 * PHƯƠNG PHÁP: Tìm kiếm theo chiều rộng (Breadth-First Search - BFS)
 * Mô tả: BFS đảm bảo tìm thấy đường đi ngắn nhất (số lần chuyển thuyền ít nhất).
 * Chúng ta mô hình hóa bài toán dưới dạng đồ thị trạng thái, trong đó mỗi node 
 * là một trạng thái hợp lệ của các nhân vật ở hai bờ sông.
 * 
 * YÊU CẦU:
 * - 3 Triệu phú (T) và 3 Cướp (C) cần qua sông.
 * - Thuyền chở tối đa 2 người và tối thiểu 1 người.
 * - Quy tắc an toàn: Ở bất kỳ bờ nào, nếu có T, thì số T phải >= số C.
 */

/**
 * Kiểm tra tính an toàn của một trạng thái dựa trên số lượng T và C.
 * @param {number} tl - Số Triệu phú ở bờ trái
 * @param {number} cl - Số Cướp ở bờ trái
 * @returns {boolean} - Trạng thái có an toàn hay không
 */
export function kiemTraAnToan(tl, cl) {
    const tr = 3 - tl; // Triệu phú bờ phải
    const cr = 3 - cl; // Cướp bờ phải
    
    // Quy tắc: Không được có số lượng âm hoặc vượt quá 3
    if (tl < 0 || cl < 0 || tl > 3 || cl > 3) return false;
    
    // Quy tắc an toàn: Tại mỗi bờ, nếu có T, thì T không được ít hơn C
    if (tl > 0 && cl > tl) return false; // Thất bại ở bờ trái
    if (tr > 0 && cr > tr) return false; // Thất bại ở bờ phải
    
    return true;
}

/**
 * Hàm sinh các trạng thái kế tiếp từ trạng thái hiện tại.
 * @param {object} state - Trạng thái hiện tại {tl, cl, boat}
 * @returns {Array} - Danh sách các trạng thái lân cận hợp lệ
 */
export function timTrangThaiKeTiep(state) {
    const { tl, cl, boat } = state;
    
    // Các tổ hợp di chuyển có thể (T, C): [1,0], [2,0], [0,1], [0,2], [1,1]
    const hanhDongCoThe = [
        [1, 0], [2, 0], [0, 1], [0, 2], [1, 1]
    ];
    
    const ketQua = [];
    for (const [dt, dc] of hanhDongCoThe) {
        let ntl, ncl, nboat;
        
        // Hướng di chuyển phụ thuộc vào vị trí thuyền
        if (boat === 'LEFT') {
            ntl = tl - dt; ncl = cl - dc; nboat = 'RIGHT';
        } else {
            ntl = tl + dt; ncl = cl + dc; nboat = 'LEFT';
        }
        
        // Kiểm tra nếu trạng thái mới này có an toàn hay không
        if (kiemTraAnToan(ntl, ncl)) {
            ketQua.push({
                tl: ntl, 
                cl: ncl, 
                boat: nboat, 
                moTa: `Dịch chuyển ${dt > 0 ? dt + 'T' : ''} ${dc > 0 ? dc + 'C' : ''}`.trim()
            });
        }
    }
    return ketQua;
}

/**
 * Thuật toán chính: Breadth-First Search (BFS)
 * Giải quyết bài toán tìm kiếm đường đi trong không gian trạng thái.
 */
export function giaiBaiToanBFS() {
    // 1. Khởi tạo trạng thái bắt đầu (3 Triệu phú, 3 Cướp, Thuyền bên Trái)
    const batDau = { tl: 3, cl: 3, boat: 'LEFT', path: [] };
    
    // 2. Queue dùng cho BFS và Set để lưu các trạng thái đã ghé thăm (tránh lặp vô tận)
    const hangDoi = [{ ...batDau, path: [batDau] }];
    const daTham = new Set();
    daTham.add(`3-3-LEFT`);
    
    while (hangDoi.length > 0) {
        // Lấy node đầu tiên ra khỏi hàng đợi (First In First Out)
        const hienTai = hangDoi.shift();
        
        // 3. Kiểm tra nếu đã đạt tới mục tiêu (Toàn bộ sang bờ Phải)
        if (hienTai.tl === 0 && hienTai.cl === 0 && hienTai.boat === 'RIGHT') {
            return hienTai.path; // Trả về lộ trình đầy đủ
        }
        
        // 4. Tìm kiếm các trạng thái lân cận
        const hangXom = timTrangThaiKeTiep(hienTai);
        for (const keTiep of hangXom) {
            const khoaTrangThai = `${keTiep.tl}-${keTiep.cl}-${keTiep.boat}`;
            
            if (!daTham.has(khoaTrangThai)) {
                daTham.add(khoaTrangThai);
                // Đưa node mới vào hàng đợi cùng với lộ trình tích lũy
                hangDoi.push({ 
                    ...keTiep, 
                    path: [...hienTai.path, keTiep] 
                });
            }
        }
    }
    
    return null; // Trả về null nếu không tìm thấy lời giải (không xảy ra với bài toán này)
}
