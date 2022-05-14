<?php

/**
 * PageController is probably the brain of the system.
 * It is here where pages are called, created, checked and loaded.
 * It has a long sting builder used to create urls for both Linux and Windows based systems
 * as well as to be able to find the right files in both.
 */
class PageController extends PageModel
{
    public object $pageObj;

    public function __construct()
    {
        $this->parseUrl();
        $this->loadPage();
    }

    /**
     * Build an url depending on the right variables and put them in the right order.
     */
    private function parseUrl()
    {
        // Load the required page from the url
        $var_str = explode('/', rtrim($_REQUEST['__uri'], '/'));
        // Cut the url in 3 parts, the baseUrl: your domain, the pageName: the page you're searching for and the pageVars, the subpage of the mentioned pageName.
        $urlArr['baseUrl'] = rtrim(str_replace($_REQUEST['__uri'], '', $_SERVER['REQUEST_URI']), '/');
        $urlArr['pageName'] = array_shift($var_str);
        $urlArr['pageVars'] = $var_str;
        // Set the urlArr
        $this->setUrlArr($urlArr);
    }

    /**
     * Load the right page depending on the url and run the page class associated with the page.
     * Returns the 404 page when the page does not exist.
     */
    private function loadPage()
    {
        // Set the pageName at load
        $page = $this->urlArr['pageName'];
        // Set to home if none given
        if (empty($page)) $page = REDIRECT;
        // Load the needed PHP class that corresponds with the page
        $objName = ucfirst(strtolower($page)) . 'Page';
        if (class_exists($objName)) $this->pageObj = new $objName($this->urlArr);
        // Get start of HTML and the HEAD
        $this->getPart('top');
        // Get the content of the BODY -> SECTION
        if (file_exists(VIEW . $page . PHTML)) require VIEW . $page . PHTML;
        else {
            require_once ERROR_404_PAGE;
            self::redirectTo(2, REDIRECT);
        }
        // Get the footer part and end of HTML
        $this->getPart('bottom');
    }

    /**
     * @param $name // Part name
     */
    public function getPart($name)
    {
        // Load the part
        $file = PARTS . $name . PHTML;
        if (file_exists($file)) require $file;
        else var_dump($file);
    }

    /**
     * @param $refresh // Refresh time, null for no delay
     * @param $location // Redirect location
     * @return void // Sends header refresh to given location with delay
     */
    public static function redirectTo($refresh, $location): void
    {
        header('Refresh: ' . $refresh . '; url=' . PageController::url($location));
    }

    /**
     * @param string $sub_url // Input location the url should redirect to
     * @return string // Return the url
     *
     * This method build an url and returns the complete path to the file to make sure
     * it loads properly on both Linux and Windows based machines it uses a complicated
     * and long sting builder and lots of trims and preg functions.
     */
    public static function url(string $sub_url = ''): string
    {
        // Make a static variable $baseurl
        static $baseurl;
        // Check if http or https, then take the host, root directory and the base directory and return a complete url path
        if (!$baseurl) $baseurl = 'http' . (!empty($_SERVER['HTTPS']) ? 's' : '') . '://' . $_SERVER['HTTP_HOST'] . preg_replace('@^' . preg_quote(rtrim(realpath($_SERVER['DOCUMENT_ROOT']), '/')) . '@', '', BASEDIR);
        $url = trim($baseurl, '/') . '/' . ltrim($sub_url, '/');
        if (is_file(rtrim(BASEDIR, '/') . '/' . $sub_url)) $url = self::addParam($url, ['_' => filemtime(rtrim(BASEDIR, '/') . '/' . $sub_url)]);
        else $url = rtrim($url, '/') . '/';
        // Return the url
        return $url;
    }

    /**
     * @param $url // Current url
     * @param $parameters // Url parameters
     * @return string // Return url with added parameters
     */
    public static function addParam($url, $parameters): string
    {
        // Add parameter
        [$page, $fragment] = explode('#', $url . '#', 2);
        $c = (!str_contains($page, '?')) ? '?' : '&';
        $page .= $c . http_build_query($parameters);
        return $page . ($fragment ? '#' . $fragment : '');
    }

    public static function getPartString($name): bool|string
    {
        // Get subpages
        $file = PARTS . $name . PHTML;
        if (file_exists($file)) {
            ob_start();
            require $file;
            $return = ob_get_contents();
        } else $return = false;
        ob_end_clean();
        return $return;
    }
}
