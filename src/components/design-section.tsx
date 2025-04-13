const DesignSection = () => {
  return (
    <section className="bg-white py-12 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">我们的设计理念</h2>
            <p className="text-gray-600 text-base md:text-lg mb-6">
              我们相信，婚礼不仅仅是一个仪式，更是一段美好爱情的见证。我们的设计团队致力于为您打造独一无二的婚礼体验，从场地布置到鲜花选择，每一个细节都充满着爱与浪漫。
            </p>
            <p className="text-gray-600 text-base md:text-lg mb-6">我们提供以下服务：</p>
            <ul className="list-disc list-inside text-gray-600 text-base md:text-lg mb-6">
              <li>场地布置</li>
              <li>鲜花设计</li>
              <li>灯光效果</li>
              <li>音乐选择</li>
              <li>定制主题</li>
            </ul>
            <p className="text-gray-600 text-base md:text-lg">让我们一起创造属于您的梦幻婚礼！</p>
          </div>
          <div>
            <img src="/images/design-section-image.jpg" alt="婚礼设计" className="rounded-lg shadow-md" />
            <p className="relative text-light-300 text-sm md:text-base italic mt-4">
              &quot;爱情是一场盛大的仪式，我们邀请您共同见证&quot;
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DesignSection
