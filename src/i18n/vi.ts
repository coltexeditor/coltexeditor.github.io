import type en from './en.ts'

export default {
  meta: {
    title: 'ColTex: trình soạn thảo LaTeX cộng tác tự lưu trữ',
    description:
      'ColTex là trình soạn thảo LaTeX cộng tác tự lưu trữ, có sẵn tác tử AI: một lựa chọn thay thế Overleaf chạy trên máy chủ của riêng bạn.',
  },
  nav: {
    docs: 'Tài liệu',
    language: 'Ngôn ngữ',
    theme: 'Chuyển giữa sáng và tối',
  },
  hero: {
    tagline: 'Trình soạn thảo LaTeX cộng tác tự lưu trữ, có sẵn tác tử AI.',
    points: ['Máy chủ của bạn', 'Tài khoản của bạn', 'Dữ liệu của bạn', 'Cộng tác thời gian thực', 'Mã nguồn mở (AGPL-3.0)'],
    copy: 'Sao chép',
    copied: 'Đã sao chép',
    replay: 'Phát lại',
    github: 'Xem trên GitHub',
  },
  install: {
    title: 'Cài đặt',
    steps: [
      'Chạy lệnh trên một máy Linux hoặc macOS có Docker. Trên Linux, trình cài đặt có thể tự cài Docker.',
      'Chọn phiên bản TeX Live bằng phím mũi tên. Trình cài đặt tải các image dựng sẵn (x86-64 hoặc ARM64) và khởi động ColTex.',
      'Mở http://<máy chủ>:3690 và tạo tài khoản quản trị viên.',
    ],
    recommended: 'Khuyến nghị: từ 2 nhân CPU và 4 GB bộ nhớ trở lên.',
  },
  docs: {
    title: 'Tài liệu',
    onThisPage: 'Trên trang này',
  },
  tour: {
    chapters: ['Đăng nhập', 'Không gian làm việc', 'Soạn thảo', 'Trình soạn thảo trực quan', 'Cộng tác', 'Tác tử AI', 'Duyệt', 'Tài liệu tham khảo', 'Lịch sử', 'Cài đặt', 'Quản trị'],
    try: 'Dùng thử bản demo',
    note: 'Bản demo chạy hoàn toàn trong trình duyệt của bạn.',
  },
  why: {
    title: 'Vì sao chọn ColTex?',
    lead: 'ColTex là một lựa chọn thay thế Overleaf cho nhóm nghiên cứu, phòng thí nghiệm hoặc cho riêng bạn, chạy trên một máy tính do bạn kiểm soát: máy bàn trong phòng thí nghiệm, máy chủ tại nhà hoặc máy chủ đám mây.',
    items: [
      {
        title: 'Mọi thứ nằm trên máy chủ của bạn',
        text: 'Dự án, lịch sử, tài khoản và các tác vụ biên dịch không bao giờ rời khỏi đó. TeX chạy trong một container cách ly, không có truy cập internet.',
      },
      {
        title: 'Được xây dựng để cùng nhau viết',
        text: 'Nhiều người cùng chỉnh sửa một tệp cùng lúc, với bình luận, theo dõi thay đổi, trò chuyện và lịch sử phiên bản.',
      },
      {
        title: 'Một tác tử AI làm việc trên dự án của bạn',
        text: 'Nó đọc các tệp và nhật ký biên dịch, soạn nháp thay đổi, biên dịch thử, rồi cho bạn xem phần khác biệt. Không có gì được ghi cho đến khi bạn áp dụng.',
      },
      {
        title: 'Cài đặt bằng một lệnh, không cần mở cổng',
        text: 'Tailscale và Cloudflare Tunnel được tích hợp sẵn để truy cập từ xa.',
      },
    ],
  },
  features: {
    title: 'Tính năng',
    groups: [
      {
        title: 'Viết và biên dịch',
        items: [
          'Trình soạn thảo mã nguồn và trình soạn thảo trực quan với trình chỉnh sửa bảng, hộp thoại chèn hình, thanh công cụ, bảng ký hiệu, dàn ý và đường dẫn điều hướng.',
          'Tự động hoàn thành LaTeX, kiểm tra mã, xem trước công thức, kiểm tra chính tả cho nhiều ngôn ngữ, đếm từ, tìm và thay thế trên toàn dự án, phím Vim hoặc Emacs.',
          'Biên dịch bằng latexmk trên TeX Live đầy đủ. Trình biên dịch (pdfLaTeX, XeLaTeX hoặc LuaLaTeX) được chọn dựa trên tài liệu, kể cả tiếng Trung.',
          'Xem trước PDF với SyncTeX theo cả hai chiều, kể cả trong một cửa sổ riêng. Lỗi biên dịch được gạch chân trong mã nguồn, kèm gợi ý dễ hiểu.',
          'Tài liệu tham khảo: trích dẫn từ các tệp .bib, thêm mục từ Crossref và arXiv hoặc bằng DOI, hoặc giữ đồng bộ một thư viện Zotero.',
        ],
      },
      {
        title: 'Cộng tác',
        items: [
          'Soạn thảo thời gian thực với con trỏ của mọi người, bình luận có @nhắc tên, theo dõi thay đổi, trò chuyện trong dự án và thông báo.',
          'Vai trò theo từng dự án: chủ sở hữu, người chỉnh sửa, người duyệt (chỉ đề xuất) và người xem.',
          'Lịch sử phiên bản như git: phiên bản tự động, phiên bản được lưu kèm mô tả, và hoàn tác thay đổi của một phiên bản.',
          'Truy cập Git: clone một dự án, làm việc cục bộ rồi push trở lại.',
        ],
      },
      {
        title: 'Tác tử AI',
        items: [
          'Hỏi về LaTeX, dự án hoặc bài viết của bạn, hoặc để nó sửa lỗi biên dịch. Nó soạn nháp thay đổi trong một bản sao riêng, biên dịch thử và cho xem phần khác biệt.',
          'Khi áp dụng, một phiên bản được lưu trước và dự án được biên dịch lại; nếu kết quả biên dịch tệ hơn, thay đổi sẽ được hoàn nguyên.',
          'Khóa API (Anthropic, OpenAI, DeepSeek, Google, OpenRouter và nhiều hơn nữa), đăng nhập gói đăng ký (Claude, ChatGPT, GitHub Copilot và nhiều hơn nữa), hoặc máy chủ của riêng bạn (Ollama, vLLM, LM Studio).',
          'Các skill bạn tự viết hoặc nhập vào, quyền từ Thủ công đến Toàn quyền, và tác tử của riêng bạn (Claude Code, Codex, Cursor…) qua MCP.',
        ],
      },
      {
        title: 'Dự án và quản trị',
        items: [
          'Mẫu cho IEEE, ACM, Springer LNCS, Elsevier, REVTeX và arXiv, và chuyển đổi từ mẫu tạp chí này sang mẫu tạp chí khác.',
          'Nhập và xuất zip của Overleaf, tệp liên kết, thẻ, lưu trữ và thùng rác.',
          'Không có đăng ký công khai: tài khoản chỉ đến từ liên kết mời.',
          'Giám sát, sao lưu WebDAV, lưu trữ cục bộ hoặc tương thích S3, chủ đề, và giao diện bằng 14 ngôn ngữ.',
        ],
      },
    ],
  },
  editions: {
    title: 'Hai phiên bản TeX Live',
    lead: 'Cả hai đều có mọi gói của TeX Live và biên dịch được cùng các tài liệu. Phiên bản full có thêm tài liệu hướng dẫn và mã nguồn, mà tác tử AI cũng đọc được.',
    head: ['Phiên bản', 'Dung lượng tải', 'Ổ đĩa (toàn bộ ColTex)', 'Dung lượng trống cần có'],
    rows: [
      ['Standard (mặc định)', 'khoảng 3 GB', 'khoảng 12 GB', '20 GB'],
      ['Full (--edition full)', 'khoảng 8 GB', 'khoảng 23 GB', '35 GB'],
    ],
  },
  faq: {
    title: 'Câu hỏi thường gặp',
    categories: [
      {
        title: 'Chung',
        items: [
          {
            q: 'ColTex có miễn phí không?',
            a: 'Có. ColTex là mã nguồn mở theo giấy phép AGPL-3.0 và chạy trên máy của riêng bạn. Các nhà cung cấp AI bạn kết nối sẽ tự tính phí với bạn.',
          },
          {
            q: 'ColTex khác Overleaf ở điểm nào?',
            a: 'ColTex hoạt động rất giống Overleaf: mã nguồn cạnh PDF, bình luận, theo dõi thay đổi và lịch sử. Nó chạy trên máy chủ do bạn kiểm soát, và có sẵn tác tử AI.',
          },
          {
            q: 'Có bản dùng trực tuyến được lưu trữ sẵn không?',
            a: 'Không. ColTex chạy trên máy tính do bạn kiểm soát. Muốn xem qua trước, hãy dùng thử bản demo trên trang này; nó chạy trong trình duyệt của bạn.',
          },
        ],
      },
      {
        title: 'Cài đặt',
        items: [
          {
            q: 'Cần gì để chạy ColTex?',
            a: 'Một máy Linux hoặc macOS có Docker (trên Linux, trình cài đặt có thể tự cài Docker) và khoảng 20 GB dung lượng trống. Khuyến nghị từ 2 nhân CPU và 4 GB bộ nhớ trở lên.',
          },
          {
            q: 'Nên chọn phiên bản TeX Live nào?',
            a: 'Standard có mọi gói và biên dịch được cùng các tài liệu. Full có thêm tài liệu hướng dẫn và mã nguồn của các gói, mà tác tử AI cũng đọc được, tốn thêm khoảng 11 GB. Bạn có thể chuyển sau bằng coltex edition full.',
          },
          {
            q: 'ColTex có chạy trên Windows không?',
            a: 'Trình cài đặt chạy trên Linux và macOS. Nếu dùng Windows, hãy cài ColTex trên một máy Linux hoặc máy chủ rồi mở nó trong trình duyệt.',
          },
          {
            q: 'Có thể dùng tên miền riêng với HTTPS không?',
            a: 'Có. Cài đặt với --domain tex.example.org, Caddy đi kèm sẽ lấy chứng chỉ. Trỏ tên miền về máy chủ và mở cổng 80 và 443.',
          },
          {
            q: 'Cập nhật bằng cách nào?',
            a: 'Chạy coltex update. Lệnh này tải bản phát hành mới nhất; cài đặt và dữ liệu của bạn được giữ nguyên.',
          },
        ],
      },
      {
        title: 'Viết và cộng tác',
        items: [
          {
            q: 'Tôi có thể mang các dự án Overleaf sang không?',
            a: 'Có. Hãy nhập tệp zip của dự án từ Overleaf; ColTex cũng xuất zip theo cùng cách đó.',
          },
          {
            q: 'Nhiều người có thể chỉnh sửa cùng lúc không?',
            a: 'Có, với con trỏ của mọi người, bình luận, theo dõi thay đổi và trò chuyện trong dự án. Mỗi dự án có chủ sở hữu, người chỉnh sửa, người duyệt (chỉ đề xuất) và người xem.',
          },
          {
            q: 'Người khác truy cập từ bên ngoài bằng cách nào?',
            a: 'Bật Tailscale hoặc Cloudflare Tunnel trong Cài đặt → Mạng, không cần mở cổng. Máy chủ có tên miền riêng có thể dùng HTTPS với --domain.',
          },
          {
            q: 'Có thể làm việc với dự án bằng Git không?',
            a: 'Có. Clone dự án bằng token cá nhân, làm việc cục bộ rồi push trở lại; các chỉnh sửa trên trình duyệt trong lúc đó sẽ được hợp nhất.',
          },
          {
            q: 'ColTex có biên dịch được tiếng Trung, tiếng Nhật và tiếng Hàn không?',
            a: 'Có. Trình biên dịch được chọn dựa trên tài liệu, nên tài liệu dùng ctex và xeCJK được biên dịch bằng XeLaTeX mà không cần cài đặt gì.',
          },
        ],
      },
      {
        title: 'Tác tử AI',
        items: [
          {
            q: 'Tác tử AI có cần gói đăng ký không?',
            a: 'Tác tử AI cần một mô hình: khóa API, đăng nhập gói đăng ký hoặc máy chủ tương thích OpenAI của riêng bạn. Mọi tính năng khác đều hoạt động mà không cần.',
          },
          {
            q: 'Tác tử AI dùng được những mô hình nào?',
            a: 'Khóa API (Anthropic, OpenAI, DeepSeek, Google, OpenRouter và nhiều hơn nữa), đăng nhập gói đăng ký (Claude, ChatGPT, GitHub Copilot và nhiều hơn nữa), hoặc máy chủ của riêng bạn như Ollama, vLLM hay LM Studio. Quản trị viên kết nối chúng.',
          },
          {
            q: 'Bài viết của tôi có được gửi tới nhà cung cấp AI không?',
            a: 'Chỉ những gì tác tử đọc cho một yêu cầu bạn đưa ra, và chỉ gửi tới nhà cung cấp của mô hình bạn đã chọn. Với mô hình trên máy chủ của riêng bạn, không có gì rời khỏi máy chủ đó.',
          },
          {
            q: 'Tác tử AI có thể thay đổi tệp của tôi mà không hỏi không?',
            a: 'Không, trừ khi bạn cho phép. Ở chế độ Thủ công, thay đổi của nó là một bản nháp để bạn xem lại và áp dụng; khi áp dụng, một phiên bản được lưu trước, và thay đổi làm kết quả biên dịch tệ hơn sẽ được hoàn nguyên.',
          },
        ],
      },
      {
        title: 'Dữ liệu và bảo mật',
        items: [
          {
            q: 'Dữ liệu của tôi được lưu ở đâu?',
            a: 'Trên máy chủ của bạn: cơ sở dữ liệu và các tệp dự án, trên ổ đĩa của máy chủ hoặc trong bộ lưu trữ tương thích S3. Dự án, lịch sử, tài khoản và các tác vụ biên dịch không bao giờ rời khỏi đó.',
          },
          {
            q: 'Có thể sao lưu không?',
            a: 'Có. Cài đặt → Lưu trữ & sao lưu gửi cơ sở dữ liệu, các tệp và lịch sử tới một thư mục WebDAV theo lịch, được mã hóa nếu bạn đặt mật khẩu.',
          },
          {
            q: 'Biên dịch có an toàn không?',
            a: 'TeX chạy trong một container riêng không có truy cập internet, với hệ thống chỉ đọc, không có đặc quyền bổ sung và có giới hạn về bộ nhớ và số tiến trình.',
          },
          {
            q: 'Ai có thể tạo tài khoản?',
            a: 'Không ai có thể tự đăng ký. Tài khoản chỉ đến từ liên kết mời do quản trị viên hệ thống, hoặc một quản trị viên cho nhóm của mình, gửi đi.',
          },
        ],
      },
    ],
  },
  footer: {
    poweredBy: 'Được lưu trữ trên GitHub Pages',
  },
} satisfies typeof en
